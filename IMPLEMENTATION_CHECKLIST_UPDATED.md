# Implementation Checklist: Support App Reference Implementation

## Updated Strategy
Building **support-app** instead of platform-cli as the reference implementation.
Hosting on **happycloud.com** via SST with LocalStack for local development.

---

## Phase 1: Support App V0 Documentation (Week 1-2)

### Repository Setup
- [ ] Create `support-app` repository on GitHub
- [ ] Initialize with README.md
- [ ] Add MANIFEST.md (strategic intent)
- [ ] Set up .gitignore

### Documentation Structure
- [ ] Initialize Astro/Starlight in `docs/` directory
- [ ] Create Diataxis folder structure:
  - [ ] `src/content/docs/explanation/`
  - [ ] `src/content/docs/reference/`
  - [ ] `src/content/docs/how-to/`
  - [ ] `src/content/docs/tutorials/`
  - [ ] `src/content/docs/prototypes/` ⭐
- [ ] Create `src/components/prototypes/` for React components

### Core Documentation Content

**Explanation Section**:
- [ ] `architecture.md` - System design, Next.js + SST architecture
- [ ] `ai-strategy.md` - RAG, embeddings, Claude API integration
- [ ] `integration-patterns.md` - Hub-and-spoke, SSO, event-driven
- [ ] `phases.md` - 4-phase roadmap explanation

**Reference Section**:
- [ ] `api/` directory with endpoint documentation
- [ ] `database-schema.md` - Drizzle schemas
- [ ] `infrastructure.md` - SST resources (RDS, Cognito, S3)
- [ ] `environment-config.md` - Dev/QA/Staging/Prod setup

**How-To Section**:
- [ ] `local-setup.md` - LocalStack installation and setup
- [ ] `deploy-to-aws.md` - SST deployment workflow
- [ ] `add-feature.md` - Development process
- [ ] `troubleshooting.md` - Common issues

**Tutorials Section**:
- [ ] `first-issue.md` - Submit and track an issue
- [ ] `ai-interaction.md` - Using AI features

### Interactive Prototypes ⭐

**Prototype Components** (React .jsx files):
- [ ] `IssueSubmission.jsx` - Phase 1: Basic issue form
- [ ] `IssueDashboard.jsx` - Issue listing and filtering
- [ ] `SmartSuggestions.jsx` - Phase 2: AI-powered doc suggestions
- [ ] `AIChatInterface.jsx` - Phase 3: Conversational interface
- [ ] `AnalyticsDashboard.jsx` - Phase 4: Metrics and trends

**Prototype Documentation** (.mdx files):
- [ ] `prototypes/index.mdx` - Overview of all prototypes
- [ ] `prototypes/phase1-basic.mdx` - Embed IssueSubmission component
- [ ] `prototypes/phase2-smart.mdx` - Embed SmartSuggestions component
- [ ] `prototypes/phase3-chat.mdx` - Embed AIChatInterface component
- [ ] `prototypes/phase4-analytics.mdx` - Embed AnalyticsDashboard component

### Configuration & Scripts
- [ ] Update `astro.config.mjs` for support-app
- [ ] Create `scripts/generate-manifest.js`
- [ ] Configure sidebar navigation
- [ ] Add GitHub Actions workflow for docs deployment

### Deployment
- [ ] Test build locally (`pnpm build`)
- [ ] Enable GitHub Pages in repository settings
- [ ] Verify deployment to `https://kandala05.github.io/support-app/`
- [ ] Test manifest.json: `https://kandala05.github.io/support-app/manifest.json`

### Team Review
- [ ] Share prototypes with team for feedback
- [ ] Iterate on UX based on feedback
- [ ] Update documentation based on questions/clarity needs

---

## Phase 2: LocalStack + SST Setup (Week 3-4)

### LocalStack Environment

**Docker Setup**:
- [ ] Create `docker-compose.yml` for LocalStack
- [ ] Configure services: S3, RDS, Cognito, CloudFront
- [ ] Add init scripts for LocalStack
- [ ] Test: `docker-compose up -d`
- [ ] Verify health: `curl http://localhost:4566/_localstack/health`

**AWS CLI Configuration**:
- [ ] Install awslocal: `pip install awscli-local`
- [ ] Test S3: `awslocal s3 mb s3://test-bucket`
- [ ] Test RDS: Verify Postgres connection
- [ ] Test Cognito: Create user pool

### SST Configuration

**Project Setup**:
- [ ] Install SST: `npm install sst`
- [ ] Create `sst.config.ts` in repository root
- [ ] Define app configuration
- [ ] Set up stage-based configuration (dev, staging, prod)

**Infrastructure Code**:
- [ ] Create `infra/` directory
- [ ] `infra/auth.ts` - Cognito user pool setup
- [ ] `infra/database.ts` - RDS PostgreSQL configuration
- [ ] `infra/storage.ts` - S3 buckets for attachments
- [ ] `infra/api.ts` - API Gateway / Lambda setup
- [ ] `infra/web.ts` - Next.js deployment configuration

**LocalStack Integration**:
- [ ] Configure SST to detect LocalStack
- [ ] Set AWS_ENDPOINT_URL environment variable
- [ ] Test deployment: `sst dev` (should use LocalStack)
- [ ] Verify resources created in LocalStack

### Testing LocalStack Deployment
- [ ] Database migrations work
- [ ] Can connect to RDS from app
- [ ] Cognito authentication works
- [ ] S3 file uploads work
- [ ] Next.js app accessible locally

---

## Phase 3: V1 Implementation (Week 5-6)

### Application Setup

**Next.js Project**:
- [ ] Initialize Next.js 15 with App Router in `src/`
- [ ] Set up TypeScript strict mode
- [ ] Configure Tailwind CSS
- [ ] Add shadcn/ui components

**Database Setup**:
- [ ] Install Drizzle ORM
- [ ] Create `src/db/schema/` directory
- [ ] Implement schemas from reference docs:
  - [ ] `issues.ts`
  - [ ] `users.ts`
  - [ ] `comments.ts`
  - [ ] `attachments.ts`
- [ ] Set up migrations: `drizzle-kit generate`
- [ ] Run migrations against LocalStack RDS

**Authentication**:
- [ ] Configure AWS Cognito integration
- [ ] Implement sign-up/sign-in flows
- [ ] Add protected routes middleware
- [ ] Test authentication flow

### Phase 1 Features (Basic Issue Tracking)

**Issue Submission**:
- [ ] Convert `IssueSubmission.jsx` prototype to real component
- [ ] Add form validation (Zod)
- [ ] Implement API route: `POST /api/issues`
- [ ] Connect to database via Drizzle
- [ ] Add file upload to S3
- [ ] Send notification emails

**Issue Dashboard**:
- [ ] Convert `IssueDashboard.jsx` prototype to real component
- [ ] Implement API route: `GET /api/issues`
- [ ] Add filtering (plane, status, priority)
- [ ] Add sorting
- [ ] Add pagination
- [ ] Implement issue detail view

**Testing**:
- [ ] Unit tests for API routes
- [ ] Integration tests with LocalStack
- [ ] E2E tests for key workflows
- [ ] Test error handling

### Documentation Updates
- [ ] Update docs with any architectural changes discovered
- [ ] Add troubleshooting entries for issues encountered
- [ ] Update reference docs with final schemas
- [ ] Verify prototypes still match implementation

---

## Phase 4: AWS Deployment with happycloud.com (Week 7+)

### Cloudflare DNS Setup

**Domain Configuration**:
- [ ] Log into Cloudflare dashboard for happycloud.com
- [ ] Verify domain is active
- [ ] Note API token for SST integration

**SST Cloudflare Integration**:
- [ ] Install: `npm install @sst/cloudflare`
- [ ] Add Cloudflare DNS to sst.config.ts
- [ ] Configure domain settings:
  ```typescript
  domain: {
    name: "platform.happycloud.com",
    dns: sst.cloudflare.dns({
      zone: "happycloud.com"
    })
  }
  ```

### AWS Dev Deployment

**First Deployment**:
- [ ] Remove LocalStack endpoint override
- [ ] Deploy to AWS: `sst deploy --stage dev`
- [ ] Verify resources created in AWS console:
  - [ ] RDS instance
  - [ ] Cognito user pool
  - [ ] S3 buckets
  - [ ] CloudFront distribution
- [ ] Check DNS records created in Cloudflare
- [ ] Test: `https://dev.platform.happycloud.com/support/`

**SSL/HTTPS**:
- [ ] Verify SSL certificate issued (auto via SST)
- [ ] Test HTTPS access
- [ ] Ensure redirect from HTTP to HTTPS

### Documentation Migration

**Move Docs to Custom Domain**:
- [ ] Deploy docs as static site via SST
- [ ] Configure path: `/support/docs/`
- [ ] Update internal links
- [ ] Test: `https://dev.platform.happycloud.com/support/docs/`

**Team Playbook Migration**:
- [ ] Create SST config for team-playbook
- [ ] Deploy to: `https://platform.happycloud.com/playbook/`
- [ ] Update all cross-links between sites
- [ ] Verify manifest.json still accessible

### Unified Routing

**Configure Routing**:
- [ ] Set up path-based routing in SST/CloudFront
- [ ] Routes:
  - `/` → Product site (future)
  - `/playbook/` → Team playbook docs
  - `/support/docs/` → Support app docs
  - `/support/` → Support app (Next.js)
- [ ] Test all routes work correctly

**Search Integration**:
- [ ] Choose search provider (Algolia or Pagefind)
- [ ] Index all documentation sites
- [ ] Implement unified search across sites
- [ ] Test search functionality

### Production Deployment

**Staging First**:
- [ ] Deploy to staging: `sst deploy --stage staging`
- [ ] Test: `https://staging.platform.happycloud.com/support/`
- [ ] Run full test suite against staging
- [ ] Get team approval

**Production**:
- [ ] Deploy to prod: `sst deploy --stage prod`
- [ ] Test: `https://platform.happycloud.com/support/`
- [ ] Monitor CloudWatch logs
- [ ] Set up alerts for errors
- [ ] Document rollback procedure

### AI Context API

**Implement Aggregation**:
- [ ] Create `/api/context` endpoint
- [ ] Fetch manifests from all doc sites
- [ ] Aggregate and return combined context
- [ ] Test: `curl https://platform.happycloud.com/api/context | jq`
- [ ] Update team AI assistant configurations

---

## Success Metrics

### V0 Documentation (Phase 1)
- ✅ All Diataxis sections complete
- ✅ 4+ interactive prototypes embedded
- ✅ Team reviewed and approved UX
- ✅ Docs deployed to GitHub Pages
- ✅ manifest.json generating correctly

### LocalStack Setup (Phase 2)
- ✅ LocalStack running via docker-compose
- ✅ SST deploying to LocalStack successfully
- ✅ All AWS services accessible locally
- ✅ Can develop without AWS costs

### V1 Implementation (Phase 3)
- ✅ Phase 1 features working in LocalStack
- ✅ Tests passing (unit, integration, E2E)
- ✅ Documentation matches implementation
- ✅ Ready for AWS deployment

### AWS Deployment (Phase 4)
- ✅ Live at platform.happycloud.com
- ✅ SSL/HTTPS working
- ✅ All docs under unified domain
- ✅ Search working across sites
- ✅ AI context API functional

---

## Current Status

**Last Updated**: [Date]

**Current Phase**: Phase 1 - V0 Documentation

**Completed**:
- ✅ Team playbook deployed
- ✅ Strategy pivot from platform-cli to support-app

**In Progress**:
- 🔨 Creating support-app repository
- 🔨 Writing V0 documentation
- 🔨 Building interactive prototypes

**Next Up**:
- 📅 LocalStack setup
- 📅 SST configuration for happycloud.com

**Blockers**: [None currently]

---

## Notes

### Decision Log
- **2025-01-10**: Switched from platform-cli to support-app as reference implementation (real business need)
- **2025-01-10**: Decided to use interactive React prototypes instead of static wireframes
- **2025-01-10**: Confirmed happycloud.com as custom domain with Cloudflare DNS

### Learnings
- [Document learnings as you progress]

### Questions
- [Track questions that arise]

---

Use this checklist to track progress through all phases of the support-app implementation!
