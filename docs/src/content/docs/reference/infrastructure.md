---
title: Infrastructure Reference
description: SST infrastructure configuration and AWS resources
---

Support App is deployed on AWS using SST (Serverless Stack). This document covers the infrastructure configuration.

## Overview

```
                         ┌─────────────────┐
                         │   CloudFront    │
                         │      (CDN)      │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
              ┌─────▼─────┐               ┌─────▼─────┐
              │  Next.js  │               │   Docs    │
              │  (Lambda) │               │   (S3)    │
              └─────┬─────┘               └───────────┘
                    │
          ┌─────────┼─────────┐
          │         │         │
    ┌─────▼───┐ ┌───▼────┐ ┌──▼───┐
    │   RDS   │ │Cognito │ │  S3  │
    │(Postgres)│ │ (Auth) │ │(Files)│
    └─────────┘ └────────┘ └──────┘
```

## SST Configuration

### Main Config

```typescript
// sst.config.ts
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "support-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        cloudflare: "5.x"
      }
    };
  },
  async run() {
    const stage = $app.stage;

    // Import infrastructure modules
    const auth = await import("./infra/auth");
    const database = await import("./infra/database");
    const storage = await import("./infra/storage");
    const web = await import("./infra/web");

    // Create resources
    const userPool = auth.create();
    const db = database.create(stage);
    const bucket = storage.create();

    // Next.js app
    const app = web.create({
      stage,
      database: db,
      userPool,
      bucket
    });

    return {
      appUrl: app.url,
      docsUrl: app.docsUrl,
      userPoolId: userPool.id
    };
  }
});
```

## Infrastructure Modules

### Authentication (infra/auth.ts)

```typescript
// infra/auth.ts
export function create() {
  const userPool = new sst.aws.CognitoUserPool("UserPool", {
    usernames: ["email"],
    triggers: {
      preSignUp: "src/functions/auth/preSignUp.handler"
    }
  });

  const client = new sst.aws.CognitoUserPoolClient("WebClient", {
    userPool: userPool.id,
    generateSecret: false
  });

  return {
    id: userPool.id,
    clientId: client.id
  };
}
```

### Database (infra/database.ts)

```typescript
// infra/database.ts
export function create(stage: string) {
  const vpc = new sst.aws.Vpc("Vpc", {
    bastion: stage === "production"
  });

  const database = new sst.aws.Postgres("Database", {
    vpc,
    scaling: {
      min: stage === "production" ? "0.5 ACU" : "0.5 ACU",
      max: stage === "production" ? "4 ACU" : "1 ACU"
    }
  });

  return {
    url: database.url,
    host: database.host,
    port: database.port,
    database: database.database,
    username: database.username,
    password: database.password
  };
}
```

### Storage (infra/storage.ts)

```typescript
// infra/storage.ts
export function create() {
  const bucket = new sst.aws.Bucket("Attachments", {
    access: "private",
    cors: {
      allowHeaders: ["*"],
      allowMethods: ["GET", "PUT", "POST"],
      allowOrigins: ["*"]
    }
  });

  return bucket;
}
```

### Web Application (infra/web.ts)

```typescript
// infra/web.ts
type WebProps = {
  stage: string;
  database: { url: string };
  userPool: { id: string; clientId: string };
  bucket: sst.aws.Bucket;
};

export function create(props: WebProps) {
  const { stage, database, userPool, bucket } = props;

  // Domain configuration
  const domain = stage === "production"
    ? "platform.happycloud.com"
    : `${stage}.platform.happycloud.com`;

  // Next.js application
  const app = new sst.aws.Nextjs("App", {
    path: "./",
    domain: {
      name: `${domain}/support`,
      dns: sst.cloudflare.dns({ zone: "happycloud.com" })
    },
    environment: {
      DATABASE_URL: database.url,
      COGNITO_USER_POOL_ID: userPool.id,
      COGNITO_CLIENT_ID: userPool.clientId,
      S3_BUCKET: bucket.name,
      ANTHROPIC_API_KEY: new sst.Secret("AnthropicApiKey").value
    },
    link: [bucket]
  });

  // Static documentation site
  const docs = new sst.aws.StaticSite("Docs", {
    path: "./docs",
    build: {
      command: "npm run build",
      output: "dist"
    },
    domain: {
      name: `${domain}/support/docs`,
      dns: sst.cloudflare.dns({ zone: "happycloud.com" })
    }
  });

  return {
    url: app.url,
    docsUrl: docs.url
  };
}
```

## Environment Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `DATABASE_URL` | PostgreSQL connection string | SST database |
| `COGNITO_USER_POOL_ID` | Cognito user pool ID | SST auth |
| `COGNITO_CLIENT_ID` | Cognito client ID | SST auth |
| `S3_BUCKET` | S3 bucket name for attachments | SST storage |
| `ANTHROPIC_API_KEY` | Claude API key | SST secrets |

### Setting Secrets

```bash
# Set the Anthropic API key
npx sst secret set AnthropicApiKey sk-ant-...
```

## LocalStack Configuration

For local development, use LocalStack to simulate AWS:

### docker-compose.yml

```yaml
version: '3.8'

services:
  localstack:
    image: localstack/localstack:latest
    ports:
      - "4566:4566"
      - "4510-4559:4510-4559"
    environment:
      - SERVICES=s3,dynamodb,rds,cognito,cloudfront,route53,iam,lambda
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
      - LAMBDA_EXECUTOR=docker
      - DOCKER_HOST=unix:///var/run/docker.sock
    volumes:
      - "./localstack:/tmp/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
```

### Running with LocalStack

```bash
# Start LocalStack
docker-compose up -d

# Check health
curl http://localhost:4566/_localstack/health

# Start SST dev (auto-detects LocalStack)
export AWS_ENDPOINT_URL=http://localhost:4566
npx sst dev
```

## Deployment Commands

```bash
# Development (LocalStack)
npx sst dev

# Deploy to AWS stage
npx sst deploy --stage dev
npx sst deploy --stage staging
npx sst deploy --stage production

# View deployed resources
npx sst console

# Remove a stage
npx sst remove --stage dev
```

## Domain Configuration

### Cloudflare DNS

SST automatically manages DNS records in Cloudflare:

```
Type: CNAME
Name: platform
Value: <cloudfront-distribution>.cloudfront.net

Type: CNAME
Name: dev.platform
Value: <dev-cloudfront-distribution>.cloudfront.net
```

### URL Structure

| Stage | URL |
|-------|-----|
| Production | `https://platform.happycloud.com/support/` |
| Staging | `https://staging.platform.happycloud.com/support/` |
| Dev | `https://dev.platform.happycloud.com/support/` |
| Docs | `https://platform.happycloud.com/support/docs/` |

## Cost Estimates

| Resource | Monthly Cost (Estimate) |
|----------|------------------------|
| RDS (Serverless v2) | $50-200 |
| Lambda | $0-10 |
| S3 | $1-5 |
| CloudFront | $5-20 |
| Cognito | Free tier |
| **Total** | **~$60-240** |

*Costs depend on usage. LocalStack eliminates dev costs.*

## Related Documents

- [Local Setup](/support-app/how-to/local-setup/) - Development environment
- [Deploy to AWS](/support-app/how-to/deploy-to-aws/) - Deployment guide
- [Architecture](/support-app/explanation/architecture/) - System design
