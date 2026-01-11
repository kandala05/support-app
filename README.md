# Support App

AI-powered support portal for tracking platform engineering issues.

## Overview

This repository contains the documentation and implementation for an intelligent support platform that:
- Captures structured issue data
- Surfaces relevant documentation proactively
- Provides AI-assisted issue creation
- Creates closed-loop learning from issue patterns

## Quick Start

### Documentation Site (V0)

```bash
cd docs
npm install
npm run dev
```

Visit `http://localhost:4321` to view the documentation.

### Build for Production

```bash
cd docs
npm run build
```

## Repository Structure

```
support-app/
├── docs/                    # V0 Documentation Site (Astro/Starlight)
│   ├── src/
│   │   ├── content/docs/    # Diataxis-organized documentation
│   │   └── components/      # React prototypes
│   └── public/
│       └── manifest.json    # AI context manifest
├── src/                     # V1+ Application (Next.js) - Future
├── infra/                   # SST Infrastructure - Future
├── MANIFEST.md              # Strategic intent
├── CLAUDE.md                # AI assistant context
└── PRD.md                   # Product requirements
```

## Documentation Structure

Following the [Diataxis framework](https://diataxis.fr/):

- **Explanation** - Architecture, AI strategy, integration patterns
- **Reference** - API docs, database schema, infrastructure specs
- **How-To** - Local setup, deployment, troubleshooting
- **Tutorials** - Step-by-step guides for common workflows
- **Prototypes** - Interactive React components demonstrating UX

## Project Phases

| Phase | Focus | Status |
|-------|-------|--------|
| V0 | Documentation & Prototypes | Current |
| V1 | Basic Issue Tracking | Planned |
| V2 | Smart Documentation Sidebar | Planned |
| V3 | Conversational AI Interface | Planned |
| V4 | Analytics & Insights | Planned |

## Links

- **Live Docs**: https://kandala05.github.io/support-app/
- **Team Playbook**: https://kandala05.github.io/team-playbook/
- **PRD**: [PRD.md](./PRD.md)

## Tech Stack

- **Documentation**: Astro + Starlight
- **Application**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: PostgreSQL + Drizzle ORM
- **Infrastructure**: AWS via SST
- **AI**: Anthropic Claude + Vercel AI SDK
- **Local Dev**: LocalStack

## License

Internal use only.
