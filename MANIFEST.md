# MANIFEST.md

## Project Identity

**Name**: support-app
**Purpose**: AI-powered support portal for tracking platform engineering issues
**Status**: V0 Documentation Phase
**Owner**: Platform Engineering Team

## Strategic Intent

### Vision

Build an intelligent support platform that not only captures issues but actively helps users resolve problems through contextual documentation and AI assistance, creating a closed-loop learning system.

### Goals

1. **Reduce Duplicate Issues** - Surface similar issues and relevant docs to prevent duplicates
2. **Enable Self-Resolution** - Proactively show documentation that solves the user's problem
3. **Improve Resolution Time** - AI-assisted categorization and routing
4. **Generate Insights** - Learn from patterns to improve documentation and processes

### Non-Goals

- WebEx/Slack bot integration (deferred)
- Customer-facing portal (deferred)
- Mobile application (out of scope)

## Architecture Overview

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
              ┌───────────────────────────────┐
              │  AWS (via SST)                │
              │  - RDS PostgreSQL             │
              │  - Cognito (Auth)             │
              │  - S3 (Attachments)           │
              │  - CloudFront (CDN)           │
              └───────────────────────────────┘
```

## Key Decisions

### Why Documentation-First?

Following the team playbook's AI-augmented development strategy:
- **V0**: Complete documentation with interactive prototypes
- **V1+**: Implementation follows documented specifications
- **AI Context**: Documentation serves as context for AI assistants

### Why Interactive Prototypes?

Instead of static wireframes:
- Demonstrate UX flows with realistic interactions
- Use mock data (no backend needed)
- Prototype code can be lifted to V1 implementation
- Clear communication of intent to team

### Why Diataxis?

Proven framework for technical documentation:
- **Tutorials**: Learning-oriented, step-by-step
- **How-To**: Task-oriented, practical
- **Reference**: Information-oriented, accurate
- **Explanation**: Understanding-oriented, conceptual

## Tech Stack Rationale

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Docs | Astro/Starlight | Fast, modern, React-compatible |
| App | Next.js 15 | Team familiarity, App Router, Server Components |
| DB | PostgreSQL + Drizzle | Type-safe, familiar, SST-compatible |
| Infra | SST | AWS native, TypeScript, excellent DX |
| AI | Claude + Vercel AI SDK | Best-in-class reasoning, streaming UI |
| Local | LocalStack | AWS parity without cost |

## Phase Roadmap

### Phase 0: V0 Documentation (Current)
- Astro/Starlight docs site
- Interactive React prototypes for all phases
- Diataxis-organized content
- GitHub Pages deployment
- manifest.json for AI context

### Phase 1: Basic Issue Tracking
- Multi-step issue submission form
- Customer/environment selection
- Plane categorization
- PostgreSQL persistence

### Phase 2: Smart Documentation Sidebar
- Real-time doc search as user types
- Diataxis-categorized results
- Feedback tracking (helpful/dismissed)
- Relevance scoring

### Phase 3: Conversational AI Interface
- Chat-based issue creation
- Claude-powered assistance
- Auto-categorization suggestions
- Embedded doc snippets

### Phase 4: Analytics & Insights
- Issue distribution dashboards
- Documentation effectiveness metrics
- AI-generated pattern detection
- Duplicate detection

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Self-resolution rate | 25%+ | Issues resolved via docs without team |
| Duplicate reduction | 30% | Compared to pre-implementation |
| Resolution time | -20% | Average time to close issues |
| Doc effectiveness | 30%+ helpful marks | Feedback tracking |

## Dependencies

### External
- Anthropic Claude API
- AWS Account
- Cloudflare (DNS for happycloud.com)

### Internal
- Team Playbook (standards reference)
- Existing documentation sites (for search integration)

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| AI hallucination | Confidence scores, human review step |
| Adoption resistance | Phase 1 simple form first, gradual AI introduction |
| Documentation gaps | Feedback loop identifies missing content |
| LocalStack parity | Test against real AWS before production |

## Team Context

This project serves as the reference implementation for the team playbook's documentation-first, AI-augmented development strategy. Lessons learned here inform future projects.

## Related Documents

- [PRD.md](./PRD.md) - Detailed product requirements
- [CLAUDE.md](./CLAUDE.md) - AI assistant context
- [Team Playbook](https://kandala05.github.io/team-playbook/) - Development standards
