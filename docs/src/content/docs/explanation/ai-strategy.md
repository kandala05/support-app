---
title: AI Strategy
description: How AI enhances the support experience through documentation and assistance
---

Support App leverages AI to transform issue tracking from passive data capture to active problem resolution.

## Core AI Principles

### 1. AI as Assistant, Not Replacement

AI augments human support engineers:
- **Suggests** categories, doesn't auto-assign
- **Surfaces** relevant docs, doesn't block submission
- **Detects** patterns, humans decide actions

### 2. Transparency

All AI suggestions include:
- Confidence scores (e.g., "92% match")
- Explanation of why suggested
- Easy override mechanism

### 3. Continuous Learning

The system improves through feedback:
- "Mark as helpful" on docs
- Category corrections by users
- Resolution notes from engineers

## AI Features by Phase

### Phase 2: Smart Documentation Sidebar

**Real-time Search**
- Triggered after 3+ words in description
- 800ms debounce to avoid excessive calls
- Searches across all documentation sites

**Diataxis Categorization**
Results grouped by documentation type:
- **How-To**: Task-focused guides
- **Explanation**: Conceptual understanding
- **Reference**: Technical specifications
- **Tutorial**: Learning-oriented walkthroughs

**Feedback Loop**
```
User types description
       ↓
Search documentation
       ↓
Show results with relevance scores
       ↓
User marks helpful OR dismisses
       ↓
Store feedback with context
       ↓
Improve future search relevance
```

### Phase 3: Conversational AI

**Natural Language Understanding**
Claude interprets user descriptions:
- Extracts key entities (customer, environment, error)
- Suggests appropriate plane/category
- Asks clarifying questions

**Embedded Documentation**
Chat responses include `<DocSnippet>` components:
```jsx
<DocSnippet
  type="how-to"
  title="Configure Pipeline Timeouts"
  url="https://docs.example.com/..."
  relevance={0.89}
/>
```

**Structured Data Extraction**
From conversation, AI extracts:
- Issue title (summarized)
- Category (plane + context)
- Description (structured)
- Related issues (if duplicates exist)

### Phase 4: Intelligent Insights

**Pattern Detection**
AI analyzes recent issues to find:
- Spikes in specific categories
- Recurring error patterns
- Customer-specific trends

**Documentation Gaps**
Identifies areas needing new docs:
- Issues with no helpful docs marked
- Common searches with no results
- Resolution patterns not documented

**Duplicate Detection**
Vector similarity search:
- Compare issue descriptions
- Show similar past issues
- Suggest linking vs. new creation

## Technical Implementation

### Claude API Integration

Using Anthropic Claude via Vercel AI SDK:

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

const result = await streamText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  messages: conversationHistory,
  tools: {
    searchDocs: { /* search documentation */ },
    categorize: { /* suggest category */ },
    findDuplicates: { /* vector similarity search */ }
  }
});
```

### Tool Calling

AI has access to tools:

| Tool | Purpose |
|------|---------|
| `searchDocs` | Search documentation by query |
| `categorize` | Suggest plane/context |
| `findDuplicates` | Find similar issues |
| `getCustomerContext` | Fetch customer/environment info |

### Search Strategy

**Phase 1: Keyword Search**
- Full-text search on documentation
- Filter by plane when context available
- Rank by keyword frequency

**Phase 2: Semantic Search (Future)**
- Generate embeddings for documents
- Vector similarity search
- Re-rank with keyword boost

### Streaming UI

Chat responses stream in real-time:

```typescript
// Client
const { messages, input, handleSubmit } = useChat({
  api: '/api/chat',
  streamProtocol: 'text'
});

// UI renders as tokens arrive
{messages.map(m => (
  <ChatMessage key={m.id} message={m} />
))}
```

## Data Flow

### Feedback Collection

```sql
-- When user marks doc as helpful
INSERT INTO doc_feedback (
  doc_url,
  doc_type,
  marked_helpful,
  issue_context  -- snapshot of plane/customer/env
) VALUES (...);
```

### Analytics Queries

```sql
-- Most effective docs
SELECT
  doc_url,
  COUNT(*) FILTER (WHERE marked_helpful) as helpful_count,
  COUNT(*) as total_views,
  helpful_count::float / total_views as effectiveness
FROM doc_feedback
GROUP BY doc_url
ORDER BY effectiveness DESC;
```

### Pattern Detection

```sql
-- Weekly issue patterns
SELECT
  plane_id,
  context_value,
  COUNT(*) as issue_count,
  DATE_TRUNC('week', created_at) as week
FROM issues
JOIN issue_plane_contexts ON ...
WHERE created_at > NOW() - INTERVAL '4 weeks'
GROUP BY plane_id, context_value, week
HAVING COUNT(*) > 3;  -- Threshold for "pattern"
```

## Privacy & Ethics

### Data Handling

- Issue descriptions may contain sensitive info
- AI doesn't store conversation history beyond session
- Feedback is anonymized for analytics

### Bias Mitigation

- AI suggestions are always optional
- User corrections are weighted in learning
- Regular audits of categorization accuracy

### Transparency

- Users know when AI is assisting
- Confidence scores shown for all suggestions
- "Why this suggestion?" explanations available

## Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| Self-resolution rate | 25%+ | Docs solving issues |
| AI categorization accuracy | 85%+ | Correct suggestions |
| Chat adoption | 40%+ | Users choosing chat |
| Doc effectiveness | 30%+ helpful marks | Useful documentation |

## Related Documents

- [Architecture](/support-app/explanation/architecture/) - System design
- [Phases](/support-app/explanation/phases/) - Feature roadmap
- [Phase 2 Prototype](/support-app/prototypes/phase2-smart/) - Smart sidebar demo
- [Phase 3 Prototype](/support-app/prototypes/phase3-chat/) - Chat interface demo
