---
title: Database Schema
description: Complete database schema reference for Support App
---

Support App uses PostgreSQL with Drizzle ORM. This document provides the complete schema reference.

## Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│  customers  │────<│  environments   │     │   planes    │
└─────────────┘     └─────────────────┘     └──────┬──────┘
       │                    │                      │
       │                    │              ┌───────┴───────┐
       │                    │              │               │
       ▼                    ▼              ▼               ▼
┌─────────────────────────────────┐  ┌──────────────┐ ┌──────────────────┐
│            issues               │  │plane_contexts│ │plane_context_opts│
└─────────────────────────────────┘  └──────────────┘ └──────────────────┘
       │           │
       │           │
       ▼           ▼
┌─────────────┐ ┌────────────────────┐
│issue_planes │ │issue_plane_contexts│
└─────────────┘ └────────────────────┘

┌─────────────┐     ┌─────────────┐
│doc_feedback │     │ resolutions │
└─────────────┘     └─────────────┘
```

## Core Tables

### customers

Stores customer/tenant information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `name` | varchar(255) | NOT NULL | Customer display name |
| `created_at` | timestamp | DEFAULT now() | Creation timestamp |

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### environments

Customer environments (dev, qa, staging, production).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `customer_id` | uuid | FK → customers | Parent customer |
| `name` | varchar(255) | NOT NULL | Environment name (e.g., "alpha-qa-01") |
| `type` | enum | NOT NULL | One of: dev, qa, staging, production |
| `created_at` | timestamp | DEFAULT now() | Creation timestamp |

```sql
CREATE TYPE env_type AS ENUM ('dev', 'qa', 'staging', 'production');

CREATE TABLE environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  name VARCHAR(255) NOT NULL,
  type env_type NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### planes

Platform capability areas (App CI/CD, EKS, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `name` | varchar(100) | NOT NULL | Display name |
| `slug` | varchar(50) | UNIQUE, NOT NULL | URL-safe identifier |
| `description` | text | NULL | Optional description |

```sql
CREATE TABLE planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

-- Seed data
INSERT INTO planes (name, slug, description) VALUES
  ('App CI/CD', 'app-cicd', 'Application build, test, and deployment pipelines'),
  ('EKS', 'eks', 'Kubernetes cluster configuration and operations'),
  ('Observability', 'observability', 'Logging, monitoring, and alerting'),
  ('Infrastructure CI/CD', 'infra-cicd', 'Infrastructure provisioning and management');
```

### plane_contexts

Dynamic dropdown fields for each plane.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `plane_id` | uuid | FK → planes | Parent plane |
| `context_key` | varchar(100) | NOT NULL | Field identifier |
| `label` | varchar(255) | NOT NULL | Display label |
| `field_type` | enum | NOT NULL | single_select, multi_select, text |
| `is_required` | boolean | DEFAULT false | Required field? |
| `display_order` | int | DEFAULT 0 | Sort order |

```sql
CREATE TYPE field_type AS ENUM ('single_select', 'multi_select', 'text');

CREATE TABLE plane_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plane_id UUID NOT NULL REFERENCES planes(id),
  context_key VARCHAR(100) NOT NULL,
  label VARCHAR(255) NOT NULL,
  field_type field_type NOT NULL DEFAULT 'single_select',
  is_required BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0
);
```

### plane_context_options

Options for dropdown context fields.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `plane_context_id` | uuid | FK → plane_contexts | Parent context |
| `value` | varchar(255) | NOT NULL | Stored value |
| `label` | varchar(255) | NOT NULL | Display label |
| `display_order` | int | DEFAULT 0 | Sort order |

```sql
CREATE TABLE plane_context_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plane_context_id UUID NOT NULL REFERENCES plane_contexts(id),
  value VARCHAR(255) NOT NULL,
  label VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0
);
```

### issues

Core issue tracking table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `customer_id` | uuid | FK → customers | Customer |
| `environment_id` | uuid | FK → environments | Environment |
| `submitter_handle` | varchar(255) | NOT NULL | WebEx handle |
| `primary_plane_id` | uuid | FK → planes | Primary category |
| `title` | varchar(500) | NOT NULL | Issue title |
| `description` | text | NOT NULL | Full description |
| `pipeline_url` | text | NULL | Optional pipeline URL |
| `status` | enum | DEFAULT 'open' | Current status |
| `created_at` | timestamp | DEFAULT now() | Created |
| `updated_at` | timestamp | DEFAULT now() | Last updated |

```sql
CREATE TYPE issue_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  environment_id UUID NOT NULL REFERENCES environments(id),
  submitter_handle VARCHAR(255) NOT NULL,
  primary_plane_id UUID NOT NULL REFERENCES planes(id),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  pipeline_url TEXT,
  status issue_status DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Update trigger
CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### issue_planes

Junction table for secondary planes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `issue_id` | uuid | FK → issues | Parent issue |
| `plane_id` | uuid | FK → planes | Related plane |
| `is_primary` | boolean | DEFAULT false | Is primary plane? |

```sql
CREATE TABLE issue_planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  plane_id UUID NOT NULL REFERENCES planes(id),
  is_primary BOOLEAN DEFAULT FALSE,
  UNIQUE(issue_id, plane_id)
);
```

### issue_plane_contexts

Stores selected context values for issues.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `issue_id` | uuid | FK → issues | Parent issue |
| `plane_context_id` | uuid | FK → plane_contexts | Context field |
| `value` | text | NOT NULL | Selected value |

```sql
CREATE TABLE issue_plane_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  plane_context_id UUID NOT NULL REFERENCES plane_contexts(id),
  value TEXT NOT NULL
);
```

### doc_feedback

Tracks documentation effectiveness.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `issue_id` | uuid | FK → issues (nullable) | Related issue |
| `doc_url` | text | NOT NULL | Documentation URL |
| `doc_type` | enum | NOT NULL | Diataxis category |
| `marked_helpful` | boolean | NOT NULL | Was it helpful? |
| `dismissed` | boolean | DEFAULT false | Was it dismissed? |
| `timestamp` | timestamp | DEFAULT now() | When marked |
| `issue_context` | jsonb | NULL | Snapshot of context |

```sql
CREATE TYPE doc_type AS ENUM ('how-to', 'explanation', 'reference', 'tutorial');

CREATE TABLE doc_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
  doc_url TEXT NOT NULL,
  doc_type doc_type NOT NULL,
  marked_helpful BOOLEAN NOT NULL,
  dismissed BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT NOW(),
  issue_context JSONB
);

-- Index for analytics queries
CREATE INDEX idx_doc_feedback_url ON doc_feedback(doc_url);
CREATE INDEX idx_doc_feedback_type ON doc_feedback(doc_type);
```

### resolutions

Tracks how issues were resolved.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `issue_id` | uuid | FK → issues | Resolved issue |
| `resolved_by` | varchar(255) | NOT NULL | Team member |
| `resolution_notes` | text | NOT NULL | How it was resolved |
| `resolved_at` | timestamp | DEFAULT now() | When resolved |

```sql
CREATE TABLE resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  resolved_by VARCHAR(255) NOT NULL,
  resolution_notes TEXT NOT NULL,
  resolved_at TIMESTAMP DEFAULT NOW()
);
```

## Drizzle Schema

Complete Drizzle ORM schema:

```typescript
// src/db/schema/index.ts
import { pgTable, uuid, varchar, text, timestamp, boolean, integer, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const envTypeEnum = pgEnum('env_type', ['dev', 'qa', 'staging', 'production']);
export const issueStatusEnum = pgEnum('issue_status', ['open', 'in_progress', 'resolved', 'closed']);
export const fieldTypeEnum = pgEnum('field_type', ['single_select', 'multi_select', 'text']);
export const docTypeEnum = pgEnum('doc_type', ['how-to', 'explanation', 'reference', 'tutorial']);

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const environments = pgTable('environments', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => customers.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: envTypeEnum('type').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const planes = pgTable('planes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  description: text('description')
});

export const issues = pgTable('issues', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => customers.id).notNull(),
  environmentId: uuid('environment_id').references(() => environments.id).notNull(),
  submitterHandle: varchar('submitter_handle', { length: 255 }).notNull(),
  primaryPlaneId: uuid('primary_plane_id').references(() => planes.id).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  pipelineUrl: text('pipeline_url'),
  status: issueStatusEnum('status').default('open'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const docFeedback = pgTable('doc_feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  issueId: uuid('issue_id').references(() => issues.id),
  docUrl: text('doc_url').notNull(),
  docType: docTypeEnum('doc_type').notNull(),
  markedHelpful: boolean('marked_helpful').notNull(),
  dismissed: boolean('dismissed').default(false),
  timestamp: timestamp('timestamp').defaultNow(),
  issueContext: jsonb('issue_context')
});
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_issues_customer ON issues(customer_id);
CREATE INDEX idx_issues_environment ON issues(environment_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_environments_customer ON environments(customer_id);
CREATE INDEX idx_doc_feedback_doc_url ON doc_feedback(doc_url);
```

## Related Documents

- [API Reference](/support-app/reference/api/) - API endpoints
- [Infrastructure](/support-app/reference/infrastructure/) - SST configuration
- [Architecture](/support-app/explanation/architecture/) - System design
