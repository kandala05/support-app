# Product Requirements Document (PRD)
## Support Issue Tracking System with AI-Powered Documentation

**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Design Complete - Ready for Implementation

---

## 1. Executive Summary

### Vision
Build an intelligent support platform that not only captures issues but actively helps users resolve problems through contextual documentation and AI assistance, creating a closed-loop learning system.

### Goals
- Reduce duplicate issue reporting by 30%
- Increase self-resolution rate to 25%+
- Improve average resolution time by 20%
- Create actionable insights for documentation improvement

---

## 2. Product Phases & Roadmap

### Phase 0/1: Foundation (Weeks 1-2)
**Objective:** Capture structured issue data

**Features:**
- Multi-step form for issue submission
- Customer & environment selection (dynamic filtering)
- Plane categorization (App CI/CD, EKS, Observability, Infrastructure CI/CD)
- Context-specific fields (e.g., pipeline stage for App CI/CD)
- Basic validation and error handling
- PostgreSQL persistence via Drizzle ORM

**User Flow:**
1. Select customer → filters available environments
2. Select environment (shows type badge: dev/qa/staging/prod)
3. Enter WebEx handle as submitter
4. Select primary plane (visual card selection)
5. Optional: Select related planes (multi-select)
6. Fill plane-specific context (dropdown, e.g., "Pipeline Stage")
7. Enter issue title, description, pipeline URL
8. Review and submit
9. Receive issue ID confirmation

**Success Metrics:**
- 100% of issues have required fields
- <2 minutes average submission time
- Zero data loss

---

### Phase 2: Smart Documentation Sidebar (Weeks 3-4)
**Objective:** Proactively surface relevant documentation as users type

**Features:**
- Real-time search triggered after 3+ words in description field
- Sidebar showing Diataxis-categorized results:
  - How-To Guides (action-oriented)
  - Explanations (conceptual understanding)
  - Reference (factual lookups)
  - Tutorials (learning-oriented)
- Doc snippets with:
  - Relevance score (confidence %)
  - Expandable content
  - Direct link to full article on happycloud.com
  - "Mark as helpful" feedback button
  - Dismiss option
- Feedback tracking to PostgreSQL (doc_feedback table)

**Technical Implementation:**
- Debounced search (800ms delay after typing stops)
- Hybrid search strategy:
  - Keyword matching with plane/context filtering
  - Semantic ranking (future: vector embeddings)
- Search against Astro documentation sites
- Loading states and empty states

**Success Metrics:**
- 30%+ of users mark at least one doc as helpful
- 15% reduction in issues submitted (self-resolution)
- <1 second search response time

---

### Phase 3: Conversational AI Interface (Weeks 5-6)
**Objective:** Provide alternative chat-based issue creation with AI assistance

**Features:**
- Mode selection screen: Structured Form vs Conversational AI
- Chat interface powered by Vercel AI SDK + Claude
- AI capabilities:
  - Natural language issue description
  - Follow-up questions to gather context
  - Embedded `<DocSnippet>` components in responses
  - Auto-categorization suggestions (plane, context, customer)
  - Confidence scores on suggestions
  - Duplicate detection inline
- Structured data extraction from conversation
- Final review step before submission
- Streaming responses with typing indicators

**User Flow (Chat Mode):**
1. User: "My deployment keeps timing out in QA"
2. AI: Responds with relevant docs + asks for environment
3. User: "Customer Alpha, alpha-qa-01, deployment stage"
4. AI: Suggests plane=App CI/CD, context=Deployment, shows confidence
5. User confirms or corrects
6. AI generates issue preview
7. User submits

**Technical Implementation:**
- `useChat` hook from AI SDK
- `streamUI` for custom components
- Tool calling for doc search
- Conversation history in state (not persisted initially)

**Success Metrics:**
- 40%+ of users choose chat over form
- 20% faster issue creation in chat mode
- Higher accuracy in categorization (AI-assisted vs manual)

---

### Phase 4: Intelligent Insights & Closed-Loop Learning (Weeks 7-8)
**Objective:** Learn from patterns and continuously improve the platform

**Features:**

#### 4.1 Analytics Dashboard (Team-Facing)
- **Summary Metrics:**
  - Total issues, open issues, resolved this month
  - Average resolution time
  - Self-resolution rate (% resolved via docs alone)
  - Trend indicators (vs last month)

- **Issue Distribution:**
  - Heatmap by plane (which areas have most issues)
  - Time-series trends
  - Customer breakdown
  - Environment type analysis (dev vs prod issues)

- **Customer Health Scores:**
  - Open issue count per customer
  - Critical issue count
  - Average resolution time
  - Status indicators (healthy/warning/critical)

- **Documentation Effectiveness:**
  - Most helpful docs (by helpful marks)
  - Docs with low effectiveness (candidates for rewrite)
  - View-to-helpful ratio
  - Coverage gaps (issues with no helpful docs)

#### 4.2 AI-Generated Insights
- **Pattern Detection:**
  - "5 users hit SAST timeout this week" → Suggest new doc
  - "IAM role misconfigs spiking" → Alert team
  - "Customer Beta trending positive" → Share what's working

- **Documentation Gaps:**
  - Issues with no helpful docs marked
  - Common search queries with no results
  - Recommendations for new content

#### 4.3 Duplicate Detection
- **Similar Issue Finder:**
  - Vector similarity search on issue descriptions
  - Shows recent similar issues with:
    - Similarity score (%)
    - Status (resolved/in-progress)
    - Resolution notes (if resolved)
    - Option to link issues
  - User can confirm duplicate or create new

#### 4.4 Auto-Tagging & Suggestions
- **AI Categorization:**
  - Learns from past issues
  - Suggests plane/context based on description
  - Shows confidence scores
  - User can accept, edit, or override
  - System learns from corrections

#### 4.5 Resolution Tracking
- **Knowledge Base Building:**
  - Team adds resolution notes when closing issues
  - AI extracts common solutions
  - Suggests doc updates based on resolutions
  - "3 issues resolved by X → Update doc Y"

**Success Metrics:**
- 25%+ self-resolution rate
- 50% reduction in duplicate issues
- 30% improvement in doc effectiveness scores
- 5+ actionable insights generated per week

---

## 3. Technical Architecture

### Stack
- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** PostgreSQL + Drizzle ORM
- **Infrastructure:** AWS via SST (CloudFront, Lambda, RDS)
- **AI:** Vercel AI SDK + Anthropic Claude
- **Documentation:** Astro (multi-site, Diataxis framework)
- **Local Dev:** LocalStack for AWS simulation

### Data Model (Complete Schema)

```typescript
// Drizzle schema structure

customers
- id (uuid, PK)
- name (string)
- created_at (timestamp)

environments
- id (uuid, PK)
- customer_id (uuid, FK → customers)
- name (string) // e.g., "alpha-qa-01"
- type (enum: dev, qa, staging, production)
- created_at (timestamp)

planes
- id (uuid, PK)
- name (string) // e.g., "App CI/CD"
- slug (string, unique) // e.g., "app-cicd"
- description (text, nullable)

plane_contexts (for dynamic dropdowns)
- id (uuid, PK)
- plane_id (uuid, FK → planes)
- context_key (string) // e.g., "pipeline_stage"
- label (string) // e.g., "Pipeline Stage"
- field_type (enum: single_select, multi_select, text)
- is_required (boolean)
- display_order (int)

plane_context_options
- id (uuid, PK)
- plane_context_id (uuid, FK → plane_contexts)
- value (string) // e.g., "SAST Scan"
- label (string) // e.g., "SAST Scan"
- display_order (int)

issues
- id (uuid, PK)
- customer_id (uuid, FK → customers)
- environment_id (uuid, FK → environments)
- submitter_handle (string) // WebEx handle
- primary_plane_id (uuid, FK → planes)
- title (string)
- description (text)
- pipeline_url (string, nullable)
- status (enum: open, in_progress, resolved, closed)
- created_at (timestamp)
- updated_at (timestamp)

issue_planes (junction for secondary planes)
- id (uuid, PK)
- issue_id (uuid, FK → issues)
- plane_id (uuid, FK → planes)
- is_primary (boolean)

issue_plane_contexts (stores selected context values)
- id (uuid, PK)
- issue_id (uuid, FK → issues)
- plane_context_id (uuid, FK → plane_contexts)
- value (string) // the selected option or text input

doc_feedback (tracks helpful/dismissed docs)
- id (uuid, PK)
- issue_id (uuid, FK → issues, nullable if marked before submission)
- doc_url (string)
- doc_type (enum: how-to, explanation, reference, tutorial)
- marked_helpful (boolean)
- dismissed (boolean)
- timestamp (timestamp)
- issue_context (jsonb) // snapshot of customer/env/plane when marked

resolutions (for closed-loop learning)
- id (uuid, PK)
- issue_id (uuid, FK → issues)
- resolved_by (string) // team member
- resolution_notes (text)
- resolved_at (timestamp)
```

### API Routes (Next.js App Router)

```
/api/customers
  GET - List all customers

/api/customers/[id]/environments
  GET - Get environments for a customer

/api/planes
  GET - List all planes with contexts

/api/issues
  POST - Create new issue
  GET - List issues (with filters: customer, plane, status, date range)

/api/issues/[id]
  GET - Get issue details
  PATCH - Update issue status/fields
  DELETE - Delete issue

/api/docs/search
  POST - Search documentation
  Body: { query, planeSlug?, limit? }
  Returns: Array of doc snippets with relevance scores

/api/docs/feedback
  POST - Record helpful/dismiss feedback
  Body: { docUrl, issueId?, helpful, context }

/api/analytics/summary
  GET - Dashboard summary stats

/api/analytics/planes
  GET - Issue distribution by plane

/api/analytics/docs-effectiveness
  GET - Doc effectiveness metrics

/api/chat (AI SDK endpoint)
  POST - Streaming chat responses
  Uses Anthropic Claude for conversational interface
```

### File Structure

```
support-app/
├── app/
│   ├── (routes)/
│   │   ├── page.tsx                    # Home/landing
│   │   ├── issues/
│   │   │   ├── new/
│   │   │   │   └── page.tsx            # Form/Chat mode selection
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx            # Issue detail view
│   │   │   └── page.tsx                # Issue list
│   │   ├── analytics/
│   │   │   └── page.tsx                # Dashboard (Phase 4)
│   │   └── chat/
│   │       └── page.tsx                # Conversational interface
│   ├── api/
│   │   ├── customers/
│   │   ├── issues/
│   │   ├── docs/
│   │   ├── analytics/
│   │   └── chat/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                              # shadcn components
│   ├── forms/
│   │   ├── CustomerEnvironmentSelector.tsx
│   │   ├── PlaneSelector.tsx
│   │   ├── IssueForm.tsx
│   │   └── ReviewSubmit.tsx
│   ├── sidebar/
│   │   ├── SmartSidebar.tsx
│   │   └── DocSnippet.tsx
│   ├── chat/
│   │   ├── ChatMessage.tsx
│   │   └── ConversationalInterface.tsx
│   └── analytics/
│       ├── StatCard.tsx
│       ├── PlaneDistributionChart.tsx
│       └── InsightCard.tsx
├── lib/
│   ├── db.ts                            # Drizzle client
│   ├── schema.ts                        # Drizzle schema
│   ├── search.ts                        # Doc search logic
│   └── analytics.ts                     # Analytics queries
├── prisma/ (if using Prisma)
├── drizzle/                             # Migrations
├── public/
├── sst.config.ts                        # SST infrastructure
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.local
```

---

## 4. User Personas

### Primary User: Platform Engineer (Your Team)
- **Needs:** Quick issue logging, categorization, tracking
- **Pain Points:** Issues scattered in WebEx, hard to track patterns
- **Goals:** Reduce time spent on duplicate issues, improve documentation

### Secondary User: Development Team
- **Needs:** Self-service troubleshooting, fast resolution
- **Pain Points:** Waiting for platform team, unclear error messages
- **Goals:** Fix issues independently, understand platform better

---

## 5. Key Features by Priority

### Must-Have (Phase 1)
✅ Issue submission form  
✅ Customer/environment selection  
✅ Plane categorization  
✅ Database persistence  
✅ Issue ID generation  

### Should-Have (Phase 2)
✅ Smart documentation sidebar  
✅ Real-time doc search  
✅ Helpful feedback tracking  
✅ Diataxis categorization  

### Could-Have (Phase 3)
✅ Conversational AI interface  
✅ Embedded doc snippets in chat  
✅ Auto-categorization suggestions  

### Won't-Have (Future)
❌ WebEx integration (bot posting updates)  
❌ Email notifications  
❌ Customer-facing portal  
❌ Mobile app  
❌ File uploads (deferred to later)  

---

## 6. Non-Functional Requirements

### Performance
- Page load: <2 seconds
- Search response: <1 second
- Database queries: <500ms
- AI response streaming: Start within 1 second

### Security
- Input validation on all forms
- SQL injection prevention (parameterized queries via Drizzle)
- Rate limiting on API endpoints
- Environment variables for secrets
- AWS IAM roles (no hardcoded credentials)

### Scalability
- Handle 100+ issues per month initially
- Support 10+ concurrent users
- Database: Start with single RDS instance, vertical scaling
- Serverless functions scale automatically

### Reliability
- 99% uptime target
- Database backups (daily)
- Error logging (CloudWatch)
- Graceful degradation (if AI fails, form still works)

---

## 7. Success Criteria

### Phase 1
- ✅ 100% of issues captured in database (no data loss)
- ✅ Team adoption: All issues go through app (not just WebEx)
- ✅ <5 minutes average submission time

### Phase 2
- ✅ 30% of users mark docs as helpful
- ✅ 15% reduction in submitted issues (self-resolved)
- ✅ 50+ doc feedback entries per month

### Phase 3
- ✅ 40% of users prefer chat mode
- ✅ AI categorization accuracy >85%
- ✅ Faster issue creation in chat vs form

### Phase 4
- ✅ 25% self-resolution rate
- ✅ 50% reduction in duplicate issues
- ✅ 3+ actionable insights per week
- ✅ Team acts on 60% of AI suggestions

---

## 8. Open Questions & Future Enhancements

### Deferred to Post-MVP
1. **WebEx Integration:**
   - Bot that posts issue updates to original WebEx thread
   - Create issue from WebEx message (slash command)
   - Requires WebEx API research and approval

2. **File Uploads:**
   - S3 storage for logs/screenshots
   - Presigned URLs for secure access
   - Progress indicators and retry logic

3. **Customer Portal:**
   - Read-only view for customers to see their issues
   - Status updates and resolution notes
   - Requires authentication/authorization

4. **Advanced Analytics:**
   - Predictive: "You're likely to encounter X"
   - Trend forecasting
   - ROI calculations (time saved)

5. **Notification System:**
   - Email alerts on status changes
   - Slack/WebEx notifications
   - Digest emails (weekly summary)

---

## 9. Design Assets

All UI mockups and interactive previews available:
- `phase1-issue-submission.jsx` - Basic form flow
- `phase2-smart-sidebar.jsx` - Doc suggestions sidebar
- `phase3-conversational.jsx` - Chat interface
- `phase4-analytics-dashboard.jsx` - Analytics & insights

Design system follows Vercel AI SDK aesthetic:
- Clean, spacious layouts
- Gradient accents (plane-specific colors)
- Smooth transitions
- Minimal but intentional animations
- Clear visual hierarchy

---

## 10. Glossary

- **Plane:** Platform capability area (e.g., App CI/CD, EKS)
- **Context:** Plane-specific subcategory (e.g., Pipeline Stage for App CI/CD)
- **Diataxis:** Documentation framework (How-To, Tutorial, Explanation, Reference)
- **Self-Resolution:** Issue resolved by user via docs, without team intervention
- **Doc Effectiveness:** Ratio of helpful marks to total views
- **Duplicate Detection:** AI similarity matching of issue descriptions

---

**Document Status:** ✅ Complete - Ready for Implementation  
**Next Steps:** Begin Week 1 of Learning Roadmap → Phase 1 Development
