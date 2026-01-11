# Claude Code Context: Support App Reference Implementation

## Updated Strategy

**Change from original plan**: Building **support-app** as the reference implementation instead of platform-cli. This is a real business need with actual users, making it a better demonstration of the playbook standards.

---

## Project Overview

### Support App
**Purpose**: AI-powered support portal for tracking platform engineering issues  
**Status**: V0 documentation phase  
**Repository**: `support-app` (new repo)  
**Documentation**: Hosted on GitHub Pages initially, then migrate to AWS/SST

### Key Innovation: Interactive Prototypes
Instead of static wireframes, we're embedding **interactive React prototypes** directly in the documentation using the JSX artifacts Claude creates. These prototypes:
- Use mock/hardcoded data
- Demonstrate UX flows interactively
- Communicate vision to team (designers, React devs, Next.js devs)
- Live in the docs site as demonstrations

---

## Repository Structure

### Multi-Repo Strategy

```
GitHub Organization/Account:
├── team-playbook/                    # ✅ DONE - Deployed
│   ├── docs/ (Astro/Starlight)
│   └── Hosted: https://kandala05.github.io/team-playbook/
│
├── support-app/                      # 🔨 NEXT - To Create
│   ├── MANIFEST.md
│   ├── docs/ (Astro/Starlight)      # V0 Documentation
│   │   ├── src/content/docs/
│   │   │   ├── explanation/
│   │   │   ├── reference/
│   │   │   ├── how-to/
│   │   │   ├── tutorials/
│   │   │   └── prototypes/          # ⭐ Interactive prototypes
│   │   └── public/manifest.json
│   ├── src/                          # V1+ Implementation (Next.js)
│   ├── infra/ (SST)                 # Infrastructure
│   └── Docs Hosted: https://kandala05.github.io/support-app/
│
└── cell-router/                      # 📅 FUTURE - Week 3
    ├── MANIFEST.md
    ├── docs/ (Astro/Starlight)
    └── Docs Hosted: https://kandala05.github.io/cell-router/
```

### Domain Strategy

**Phase 1: GitHub Pages** (Current - Week 1-3)
```
https://kandala05.github.io/team-playbook/       # Team standards
https://kandala05.github.io/support-app/         # Support app docs
https://kandala05.github.io/cell-router/         # Cell router docs
```

**Phase 2: Custom Domain** (Week 4+)
```
https://platform.happycloud.com/                 # Product site (SST on AWS)
https://platform.happycloud.com/playbook/        # Team playbook
https://platform.happycloud.com/support/docs/    # Support app docs
https://platform.happycloud.com/support/         # Support app (Next.js on SST)
https://platform.happycloud.com/cell-router/docs/# Cell router docs
```

**Routing**: Cloudflare Worker or AWS CloudFront to route paths to appropriate origins

---

## Support App Repository Structure (Detailed)

```
support-app/
├── MANIFEST.md                       # Strategic intent
├── README.md                         # Quick start
├── .cursorrules                      # AI context (for Cursor users)
├── CLAUDE.md                         # AI context (for Claude Code users)
│
├── docs/                             # V0 Documentation Site
│   ├── astro.config.mjs
│   ├── package.json
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── prototypes/          # ⭐ React prototype components
│   │   │       ├── IssueSubmission.jsx
│   │   │       ├── IssueDashboard.jsx
│   │   │       ├── AIChatInterface.jsx
│   │   │       └── AnalyticsDashboard.jsx
│   │   └── content/docs/
│   │       ├── index.mdx
│   │       ├── explanation/
│   │       │   ├── architecture.md
│   │       │   ├── ai-strategy.md
│   │       │   └── integration-patterns.md
│   │       ├── reference/
│   │       │   ├── api/
│   │       │   ├── database-schema.md
│   │       │   ├── infrastructure.md
│   │       │   └── environment-config.md
│   │       ├── how-to/
│   │       │   ├── local-setup.md
│   │       │   ├── deploy-to-aws.md
│   │       │   └── troubleshooting.md
│   │       ├── tutorials/
│   │       │   ├── first-issue.md
│   │       │   └── ai-interaction.md
│   │       └── prototypes/          # ⭐ Prototype documentation
│   │           ├── index.mdx        # Overview of all prototypes
│   │           ├── phase1-basic.mdx # Issue submission prototype
│   │           ├── phase2-smart.mdx # AI suggestions prototype
│   │           ├── phase3-chat.mdx  # Conversational UI prototype
│   │           └── phase4-analytics.mdx # Analytics prototype
│   ├── public/
│   │   └── manifest.json
│   └── scripts/
│       └── generate-manifest.js
│
├── src/                              # V1+ Application Code (Next.js 15)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── db/
│
├── infra/                            # SST Infrastructure
│   ├── api.ts
│   ├── auth.ts
│   ├── database.ts
│   └── storage.ts
│
├── sst.config.ts                     # SST configuration
├── docker-compose.yml                # LocalStack setup
├── package.json
└── tsconfig.json
```

---

## Interactive Prototypes Strategy

### What Are Prototypes?

**Interactive React components** embedded in documentation that:
- Demonstrate UX flows with realistic interactions
- Use mock/hardcoded data (no backend needed)
- Run directly in the browser (no deployment needed)
- Show the vision to team members clearly

### Why Prototypes > Wireframes?

| Aspect | Traditional Wireframes | Interactive Prototypes |
|--------|----------------------|----------------------|
| **Interactivity** | Static images | Clickable, functional |
| **Data** | Lorem ipsum | Realistic mock data |
| **Communication** | Ambiguous | Clear UX intent |
| **Iteration** | Slow (design tools) | Fast (code in docs) |
| **Handoff** | Designer → Dev | Already in React code |

### Prototype Implementation in Astro/Starlight

**File**: `docs/src/content/docs/prototypes/phase1-basic.mdx`

```mdx
---
title: "Phase 1: Basic Issue Submission"
description: Interactive prototype of the issue submission form
---

import IssueSubmission from '@components/prototypes/IssueSubmission.jsx';

# Phase 1: Basic Issue Submission Prototype

This interactive prototype demonstrates the core issue submission workflow.

## Features Shown
- Issue title and description input
- Plane categorization (App CI/CD, EKS, Observability, Infrastructure)
- Priority selection
- File attachment
- Form validation

## Try It Out

<IssueSubmission client:load />

## Design Notes

- **Plane Selection**: Radio buttons for clear categorization
- **Priority**: Visual indicators (colors) for severity
- **Validation**: Real-time feedback on required fields
- **Mobile**: Responsive design shown in prototype

## Implementation Notes for Developers

When building V1:
1. Replace mock submission with actual API call
2. Add authentication (Cognito)
3. Store in database (see `/reference/database-schema/`)
4. Trigger notifications (see `/explanation/integration-patterns/`)
```

**Component**: `docs/src/components/prototypes/IssueSubmission.jsx`

```jsx
import { useState } from 'react';

export default function IssueSubmission() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    plane: '',
    priority: 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    alert(`Issue submitted! (This is a prototype - no data saved)
    
Title: ${formData.title}
Plane: ${formData.plane}
Priority: ${formData.priority}`);
  };

  return (
    <div className="prototype-container">
      <form onSubmit={handleSubmit} className="issue-form">
        {/* Form fields here - realistic, interactive */}
      </form>
    </div>
  );
}
```

### Benefits for Team Communication

**For Designer**:
- See the UX flow interactively
- Provide feedback on actual interactions
- Iterate quickly on prototypes

**For React Developer**:
- Prototype IS React code already
- Components show state management patterns
- Can lift and shift to V1 implementation

**For Next.js Developer**:
- Understands API contracts from prototype interactions
- Sees data flow clearly
- Knows expected behavior

---

## Deployment Strategy

### Phase 1: Documentation on GitHub Pages (Weeks 1-3)

**Setup**:
```yaml
# .github/workflows/docs-deploy.yml
name: Deploy Docs to GitHub Pages

on:
  push:
    branches: [main]
    paths: ['docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install pnpm
        uses: pnpm/action-setup@v2
      - name: Build docs
        run: |
          cd docs
          pnpm install
          pnpm build
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
        with:
          folder: docs/dist
```

**Result**: `https://kandala05.github.io/support-app/`

---

### Phase 2: AWS with SST + LocalStack (Week 4+)

#### Step 1: LocalStack Setup

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  localstack:
    image: localstack/localstack:latest
    ports:
      - "4566:4566"      # LocalStack gateway
      - "4510-4559:4510-4559"
    environment:
      - SERVICES=s3,dynamodb,rds,cognito,cloudfront,route53
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
    volumes:
      - "./localstack:/tmp/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
```

**Usage**:
```bash
# Start LocalStack
docker-compose up -d

# Deploy to LocalStack
export AWS_ENDPOINT_URL=http://localhost:4566
sst dev

# SST automatically detects LocalStack
```

#### Step 2: SST Configuration for happycloud.com

**sst.config.ts**:
```typescript
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "support-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const stage = $app.stage; // dev, staging, prod
    
    // Import infrastructure
    const auth = await import("./infra/auth");
    const database = await import("./infra/database");
    const web = await import("./infra/web");
    
    // Create resources
    const cognito = auth.create();
    const db = database.create(stage);
    
    // Next.js app
    const app = new sst.aws.Nextjs("SupportApp", {
      domain: {
        name: stage === "production" 
          ? "platform.happycloud.com"
          : `${stage}.platform.happycloud.com`,
        dns: sst.cloudflare.dns(),
      },
      environment: {
        DATABASE_URL: db.url,
        COGNITO_USER_POOL_ID: cognito.userPoolId,
      },
    });
    
    // Documentation site (static)
    const docs = new sst.aws.StaticSite("SupportAppDocs", {
      path: "./docs",
      build: {
        command: "pnpm build",
        output: "dist",
      },
      domain: {
        name: stage === "production"
          ? "platform.happycloud.com/support/docs"
          : `${stage}.platform.happycloud.com/support/docs`,
        dns: sst.cloudflare.dns(),
      },
    });
    
    return {
      app: app.url,
      docs: docs.url,
    };
  },
});
```

#### Step 3: Cloudflare DNS Configuration

**In Cloudflare Dashboard** (happycloud.com):
```
Type: CNAME
Name: platform
Value: [AWS CloudFront distribution]

Type: CNAME  
Name: dev.platform
Value: [Dev CloudFront distribution]
```

**Or via SST/Cloudflare integration**:
```typescript
domain: {
  name: "platform.happycloud.com",
  dns: sst.cloudflare.dns({
    zone: "happycloud.com"
  }),
}
```

SST automatically creates DNS records in Cloudflare.

---

## Development Workflow

### Week 1-2: Support App V0 Documentation

**Tasks**:
1. Create `support-app` repository
2. Initialize Astro/Starlight docs structure
3. Write core documentation:
   - Architecture explanation
   - Database schema reference
   - API reference
   - How-to guides
4. **Create interactive prototypes** for all 4 phases
5. Deploy docs to GitHub Pages
6. Generate manifest.json

**Deliverables**:
- ✅ Complete V0 documentation
- ✅ Interactive prototypes for team review
- ✅ Live docs at `https://kandala05.github.io/support-app/`
- ✅ manifest.json for AI context

### Week 3-4: LocalStack + SST Setup

**Tasks**:
1. Set up LocalStack with docker-compose
2. Configure SST for support-app
3. Test infrastructure deployment to LocalStack
4. Verify RDS, Cognito, S3 work locally
5. Test Next.js app deployment to LocalStack

**Deliverables**:
- ✅ LocalStack environment running
- ✅ SST deploying to LocalStack successfully
- ✅ Can develop against local AWS

### Week 5-6: V1 Implementation

**Tasks**:
1. Implement Phase 1 features following V0 docs
2. Convert prototypes to real components
3. Connect to LocalStack RDS
4. Implement authentication with Cognito
5. Test end-to-end locally

**Deliverables**:
- ✅ Phase 1 working in LocalStack
- ✅ Tests passing
- ✅ Documentation updated with any changes

### Week 7+: AWS Deployment

**Tasks**:
1. Deploy to AWS dev environment
2. Configure Cloudflare DNS for happycloud.com
3. Test production deployment flow
4. Migrate docs to custom domain
5. Set up unified routing

**Deliverables**:
- ✅ Support app live at `platform.happycloud.com/support/`
- ✅ Docs at `platform.happycloud.com/support/docs/`
- ✅ Team playbook at `platform.happycloud.com/playbook/`

---

## Commands Reference

### Documentation Development
```bash
# Create new repo
mkdir support-app && cd support-app
git init

# Initialize docs
cd docs
npm create astro@latest . -- --template starlight

# Dev mode
pnpm dev

# Build
pnpm build

# Deploy to GitHub Pages (via Actions)
git push origin main
```

### LocalStack Development
```bash
# Start LocalStack
docker-compose up -d

# Check services
curl http://localhost:4566/_localstack/health

# Deploy with SST
export AWS_ENDPOINT_URL=http://localhost:4566
sst dev

# Access app locally
open http://localhost:3000
```

### AWS Deployment
```bash
# Deploy to dev
sst deploy --stage dev

# Deploy to staging
sst deploy --stage staging

# Deploy to production
sst deploy --stage prod

# Check resources
sst console
```

---

## Success Criteria

### V0 Complete When:
- ✅ All Diataxis sections have content
- ✅ 4 interactive prototypes embedded in docs
- ✅ Docs deployed to GitHub Pages
- ✅ manifest.json generating correctly
- ✅ Team can review prototypes and provide feedback

### LocalStack Complete When:
- ✅ docker-compose up works
- ✅ SST deploys to LocalStack
- ✅ Can access RDS locally
- ✅ Cognito authentication works
- ✅ Next.js app runs against LocalStack

### V1 Complete When:
- ✅ Phase 1 features implemented
- ✅ Working against LocalStack
- ✅ Tests passing
- ✅ Ready for AWS deployment

### AWS Complete When:
- ✅ Deployed to platform.happycloud.com
- ✅ DNS configured correctly
- ✅ SSL certificates working
- ✅ All sites accessible under unified domain

---

## Next Steps

1. **Create support-app repository** structure
2. **Write MANIFEST.md** for support-app
3. **Build V0 documentation** with prototypes
4. **Set up LocalStack** environment
5. **Configure SST** for AWS deployment
6. **Implement V1** following V0 docs

---

## Files to Update in Team Playbook

### Update: PHASED_ROADMAP.md
Change Phase 2 from "platform-cli" to "support-app" with LocalStack/SST details

### Update: DOCUMENTATION_PORTFOLIO.md
Add details about interactive prototypes strategy

### Create New: LOCALSTACK_SST_GUIDE.md
Complete guide for LocalStack + SST setup for happycloud.com

---

Ready to start creating the support-app repository and V0 documentation!
