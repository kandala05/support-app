---
title: Architecture Overview
description: System design and architectural decisions for Support App
---

This document explains the architectural design of Support App, covering the system components, data flow, and key design decisions.

## System Overview

Support App is built as a modern, serverless web application with AI-powered features:

```
┌─────────────────────────────────────────────────────────────┐
│                     Support App                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Form UI    │  │   Chat UI    │  │  Dashboard   │       │
│  │   (Phase 1)  │  │   (Phase 3)  │  │  (Phase 4)   │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         ▼                 ▼                 ▼                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Next.js API Routes                      │    │
│  └─────────────────────────────────────────────────────┘    │
│         │                 │                 │                │
│         ▼                 ▼                 ▼                │
│  ┌───────────┐    ┌───────────┐    ┌───────────────┐        │
│  │ PostgreSQL│    │  Claude   │    │ Doc Search    │        │
│  │ (Drizzle) │    │   API     │    │ (Embeddings)  │        │
│  └───────────┘    └───────────┘    └───────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────────┐
              │  AWS (via SST)                    │
              │  - RDS PostgreSQL                 │
              │  - Cognito (Auth)                 │
              │  - S3 (Attachments)               │
              │  - CloudFront (CDN)               │
              └───────────────────────────────────┘
```

## Component Layers

### Frontend Layer

**Next.js 15 with App Router** provides:
- Server-side rendering for fast initial loads
- React Server Components for reduced client bundle
- API routes for backend logic
- Built-in optimization for images and fonts

**Key UI Patterns**:
- Multi-step form wizard for issue submission
- Real-time documentation sidebar
- Streaming chat interface
- Analytics dashboard with visualizations

### API Layer

All backend logic runs through Next.js API routes:

| Route | Purpose |
|-------|---------|
| `/api/issues` | CRUD operations for issues |
| `/api/customers` | Customer and environment data |
| `/api/docs/search` | Documentation search |
| `/api/chat` | AI conversation endpoint |
| `/api/analytics` | Dashboard metrics |

### Data Layer

**PostgreSQL with Drizzle ORM** provides:
- Type-safe database access
- Automatic migration generation
- Connection pooling via RDS Proxy

**Key Tables**:
- `issues` - Core issue tracking
- `customers` / `environments` - Customer context
- `planes` / `plane_contexts` - Categorization
- `doc_feedback` - Documentation effectiveness tracking

### AI Layer

**Claude API Integration**:
- Issue categorization suggestions
- Conversational issue creation
- Duplicate detection
- Pattern recognition

**Document Search**:
- Keyword-based search initially
- Vector embeddings for semantic search (future)
- Diataxis-categorized results

## Infrastructure

### AWS Resources (via SST)

| Resource | Purpose |
|----------|---------|
| RDS PostgreSQL | Primary database |
| Cognito | User authentication |
| S3 | File attachments |
| CloudFront | CDN distribution |
| Lambda | Serverless functions |

### Local Development

**LocalStack** simulates AWS services locally:
- Zero cloud costs during development
- Fast iteration without deployments
- Parity with production environment

## Design Decisions

### Why Next.js?

1. **Team Familiarity** - Most team members know React
2. **Full-Stack** - API routes eliminate need for separate backend
3. **App Router** - Modern React features (Server Components, Suspense)
4. **Vercel AI SDK** - Native streaming chat support

### Why SST?

1. **TypeScript Native** - Infrastructure as TypeScript code
2. **Live Lambda Dev** - Hot reload for serverless functions
3. **AWS Native** - Direct AWS resource access
4. **Great DX** - `sst dev` provides instant feedback

### Why Drizzle?

1. **Type Safety** - Full TypeScript inference
2. **Performance** - Lightweight, no runtime overhead
3. **Flexibility** - SQL-like syntax when needed
4. **Migrations** - Automatic schema diffing

### Why Documentation-First?

Following the team playbook strategy:
1. **Clarity** - Forces architectural decisions upfront
2. **Communication** - Prototypes show intent clearly
3. **AI Context** - Documentation feeds AI assistants
4. **Iteration** - Easier to change docs than code

## Data Flow Examples

### Issue Submission Flow

```
User fills form → Validation → API call → Database insert
                                ↓
                    Doc search triggered
                                ↓
                    Feedback recorded
```

### AI Chat Flow

```
User message → Claude API → Stream response
                   ↓
         Tool calls for:
         - Doc search
         - Categorization
         - Duplicate check
```

### Analytics Flow

```
Cron job → Aggregate metrics → Cache in Redis
              ↓
    Dashboard fetches cached data
```

## Security Considerations

- **Authentication**: AWS Cognito with JWT tokens
- **Authorization**: Row-level security in database
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: API Gateway throttling
- **Secrets**: AWS Secrets Manager / SST secrets

## Scalability

The serverless architecture scales automatically:
- **Lambda**: Scales with request volume
- **RDS**: Vertical scaling, read replicas if needed
- **CloudFront**: Global CDN distribution
- **S3**: Unlimited storage for attachments

## Related Documents

- [AI Strategy](/support-app/explanation/ai-strategy/) - AI integration approach
- [Phases Overview](/support-app/explanation/phases/) - Product roadmap
- [Database Schema](/support-app/reference/database-schema/) - Data model details
- [Infrastructure](/support-app/reference/infrastructure/) - SST configuration
