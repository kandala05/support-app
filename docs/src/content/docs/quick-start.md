---
title: Quick Start
description: Get up and running with Support App development
---

This guide helps you get started with Support App development.

## Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Docker (for LocalStack)
- Git

## Clone & Install

```bash
# Clone the repository
git clone https://github.com/kandala05/support-app.git
cd support-app

# Install docs dependencies
cd docs
npm install
```

## Run Documentation Site

```bash
# Start development server
npm run dev

# Open in browser
open http://localhost:4321/support-app/
```

## Project Structure

```
support-app/
├── docs/                    # V0 Documentation (Astro/Starlight)
│   ├── src/
│   │   ├── content/docs/    # Markdown content
│   │   └── components/      # React prototypes
│   └── public/
│       └── manifest.json    # AI context
├── src/                     # V1+ Application (Next.js)
├── infra/                   # SST Infrastructure
├── MANIFEST.md              # Strategic intent
└── PRD.md                   # Product requirements
```

## Next Steps

1. **Explore Documentation** - Browse the [Explanation](/support-app/explanation/architecture/) section
2. **Try Prototypes** - Interact with [live prototypes](/support-app/prototypes/)
3. **Set Up LocalStack** - Follow [Local Setup](/support-app/how-to/local-setup/) guide

## Current Phase

We're in **V0 Documentation Phase**. The application code (V1+) will be implemented after documentation is complete and reviewed.

## Need Help?

- Check [Troubleshooting](/support-app/how-to/troubleshooting/)
- Review [Team Playbook](https://kandala05.github.io/team-playbook/) for standards
