---
title: Product Phases
description: The phased approach to building Support App features
---

Support App is built incrementally across four phases, each adding more intelligent capabilities while maintaining a working product at every stage.

## Phase Overview

| Phase | Focus | Key Feature |
|-------|-------|-------------|
| **Phase 1** | Foundation | Structured issue submission |
| **Phase 2** | Smart Docs | Real-time documentation sidebar |
| **Phase 3** | AI Chat | Conversational issue creation |
| **Phase 4** | Insights | Analytics and pattern detection |

## Phase 1: Foundation

**Objective**: Capture structured issue data reliably.

### Features

- **Multi-step Form Wizard**
  - Step 1: Customer & environment selection
  - Step 2: Plane categorization
  - Step 3: Issue details
  - Step 4: Review & submit

- **Dynamic Filtering**
  - Select customer → filters environments
  - Select plane → shows plane-specific context fields

- **Categorization**
  - Primary plane (required)
  - Secondary planes (optional)
  - Context-specific fields (e.g., "Pipeline Stage" for App CI/CD)

### Success Criteria

- 100% of issues have required fields
- < 2 minutes average submission time
- Zero data loss

### Why Start Here?

1. **Data Foundation**: Clean, structured data enables future AI features
2. **Immediate Value**: Replaces scattered WebEx threads
3. **Low Risk**: No AI means predictable behavior

## Phase 2: Smart Documentation Sidebar

**Objective**: Proactively surface relevant documentation as users type.

### Features

- **Real-time Search**
  - Triggered after 3+ words in description
  - 800ms debounce to avoid API spam
  - Searches documentation sites

- **Diataxis-Categorized Results**
  - How-To Guides (task-focused)
  - Explanations (conceptual)
  - References (specifications)
  - Tutorials (learning paths)

- **Doc Snippets**
  - Title and excerpt
  - Relevance score
  - Expandable content
  - Link to full article
  - "Mark as helpful" button

- **Feedback Tracking**
  - Records helpful marks with context
  - Tracks dismissals
  - Builds effectiveness metrics

### Success Criteria

- 30%+ of users mark at least one doc as helpful
- 15% reduction in submitted issues (self-resolved)
- < 1 second search response time

### Why This Phase?

1. **Self-Service**: Users might solve their own issues
2. **Data Collection**: Feedback improves documentation
3. **Non-Intrusive**: Sidebar doesn't block submission

## Phase 3: Conversational AI Interface

**Objective**: Provide an alternative, AI-assisted way to create issues.

### Features

- **Mode Selection**
  - Structured Form (Phase 1/2)
  - Conversational AI (new)

- **Chat Interface**
  - Natural language input
  - Streaming responses
  - Typing indicators

- **AI Capabilities**
  - Follow-up questions
  - Embedded doc snippets
  - Auto-categorization suggestions
  - Duplicate detection

- **Structured Extraction**
  - AI extracts: title, category, description
  - User confirms or edits
  - Final review before submission

### Example Conversation

```
User: "My deployment keeps timing out in QA"

AI: "I can help with that. Here's a relevant doc..."
    [DocSnippet: Configure Timeout Settings]
    "Which customer environment is this for?"

User: "Customer Alpha, alpha-qa-01"

AI: "Got it. Based on your description, this looks like:
    - Plane: App CI/CD
    - Context: Application Deployment
    Does that seem right?"
```

### Success Criteria

- 40%+ of users choose chat over form
- 20% faster issue creation
- Higher categorization accuracy (AI-assisted vs. manual)

### Why This Phase?

1. **User Preference**: Some prefer natural language
2. **Better Context**: AI asks clarifying questions
3. **Reduced Friction**: Conversational flow feels easier

## Phase 4: Intelligent Insights

**Objective**: Learn from patterns and continuously improve.

### Features

#### Analytics Dashboard

- **Summary Metrics**
  - Total issues, open, resolved
  - Average resolution time
  - Self-resolution rate

- **Visualizations**
  - Issue distribution by plane
  - Time-series trends
  - Customer health scores

- **Documentation Effectiveness**
  - Most helpful docs
  - Low-effectiveness docs (rewrite candidates)
  - Coverage gaps

#### AI-Generated Insights

- **Pattern Detection**
  - "5 SAST timeout issues this week"
  - Suggests creating new documentation

- **Documentation Gaps**
  - Issues with no helpful docs
  - Recommends new content

- **Positive Trends**
  - "Customer Beta issues down 40%"
  - Attributes to recent doc updates

#### Duplicate Detection

- **Similar Issue Finder**
  - Vector similarity search
  - Shows resolution if resolved
  - Option to link issues

#### Resolution Tracking

- **Knowledge Building**
  - Engineers add resolution notes
  - AI extracts common solutions
  - Suggests doc updates

### Success Criteria

- 25%+ self-resolution rate
- 50% reduction in duplicate issues
- 5+ actionable insights per week
- Team acts on 60% of AI suggestions

### Why This Phase?

1. **Closed Loop**: Learning from outcomes improves inputs
2. **Proactive**: Identify issues before they escalate
3. **ROI Justification**: Metrics prove documentation value

## Implementation Timeline

```
Week 1-2:  V0 Documentation + Prototypes ← Current
Week 3-4:  Phase 1 Implementation
Week 5-6:  Phase 2 Implementation
Week 7-8:  Phase 3 Implementation
Week 9-10: Phase 4 Implementation
Week 11+:  Iteration and refinement
```

## Try the Prototypes

Experience each phase interactively:

- [Phase 1: Issue Submission](/support-app/prototypes/phase1-basic/)
- [Phase 2: Smart Sidebar](/support-app/prototypes/phase2-smart/)
- [Phase 3: Chat Interface](/support-app/prototypes/phase3-chat/)
- [Phase 4: Analytics Dashboard](/support-app/prototypes/phase4-analytics/)

## Related Documents

- [Architecture](/support-app/explanation/architecture/) - Technical design
- [AI Strategy](/support-app/explanation/ai-strategy/) - AI integration approach
- [PRD](/support-app/reference/prd/) - Full product requirements
