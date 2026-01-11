---
title: Local Development Setup
description: Set up your local development environment for Support App
---

This guide walks through setting up a complete local development environment for Support App.

## Prerequisites

- **Node.js 20+** - [Download](https://nodejs.org/)
- **pnpm** (recommended) - `npm install -g pnpm`
- **Docker** - [Download](https://docker.com/)
- **Git** - [Download](https://git-scm.com/)

## Quick Start

```bash
# Clone repository
git clone https://github.com/kandala05/support-app.git
cd support-app

# Install dependencies
pnpm install

# Start documentation site
cd docs
pnpm dev
```

Visit `http://localhost:4321/support-app/` to see the docs.

## Full Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/kandala05/support-app.git
cd support-app
pnpm install
```

### 2. Start LocalStack

LocalStack simulates AWS services locally:

```bash
# Start LocalStack
docker-compose up -d

# Verify it's running
curl http://localhost:4566/_localstack/health
```

Expected response:
```json
{
  "services": {
    "s3": "running",
    "rds": "running",
    "cognito": "running"
  }
}
```

### 3. Configure Environment

Create `.env.local` in the project root:

```bash
# Database (LocalStack)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/support_app

# AWS (LocalStack)
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-east-1

# Cognito (LocalStack)
COGNITO_USER_POOL_ID=local_pool
COGNITO_CLIENT_ID=local_client

# AI (optional for development)
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Start SST Development Mode

```bash
# Set LocalStack endpoint
export AWS_ENDPOINT_URL=http://localhost:4566

# Start SST dev mode
npx sst dev
```

This will:
- Deploy infrastructure to LocalStack
- Start the Next.js dev server
- Enable hot reload for Lambda functions

### 5. Run Database Migrations

```bash
# Generate migrations from schema
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit push
```

### 6. Seed Sample Data

```bash
npx tsx scripts/seed.ts
```

## Directory Structure

```
support-app/
├── docs/                    # Documentation site (Astro)
│   ├── src/content/docs/    # Markdown content
│   └── src/components/      # React prototypes
├── src/                     # Next.js application
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   └── db/                  # Drizzle schema
├── infra/                   # SST infrastructure
├── scripts/                 # Utility scripts
└── docker-compose.yml       # LocalStack config
```

## Common Tasks

### Run Documentation Site Only

```bash
cd docs
pnpm dev
# Open http://localhost:4321/support-app/
```

### Run Application Only

```bash
# Without SST (direct Next.js)
pnpm dev

# With SST (full stack)
npx sst dev
```

### Reset LocalStack

```bash
docker-compose down -v
docker-compose up -d
```

### View Database

```bash
# Connect via psql
psql postgresql://postgres:postgres@localhost:5432/support_app

# Or use Drizzle Studio
npx drizzle-kit studio
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

### LocalStack Not Starting

```bash
# Check Docker logs
docker-compose logs localstack

# Ensure Docker has enough resources
# Docker Desktop > Settings > Resources > Memory: 4GB+
```

### Database Connection Failed

```bash
# Verify PostgreSQL is running in LocalStack
curl http://localhost:4566/_localstack/health | jq .services.rds

# Check connection string
echo $DATABASE_URL
```

### SST Dev Not Working

```bash
# Clear SST cache
rm -rf .sst

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

## Next Steps

- [Deploy to AWS](/support-app/how-to/deploy-to-aws/) - Production deployment
- [Troubleshooting](/support-app/how-to/troubleshooting/) - Common issues
- [Architecture](/support-app/explanation/architecture/) - System design
