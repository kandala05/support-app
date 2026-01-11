---
title: API Reference
description: Complete API endpoint documentation for Support App
---

Support App exposes RESTful API endpoints via Next.js API routes. All endpoints require authentication unless noted otherwise.

## Base URL

| Environment | Base URL |
|-------------|----------|
| Production | `https://platform.happycloud.com/support/api` |
| Staging | `https://staging.platform.happycloud.com/support/api` |
| Development | `http://localhost:3000/api` |

## Authentication

All authenticated endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained via AWS Cognito authentication flow.

## Endpoints

### Customers

#### GET /api/customers

List all customers.

**Response**
```json
{
  "customers": [
    {
      "id": "uuid",
      "name": "Customer Alpha",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### GET /api/customers/:id/environments

Get environments for a specific customer.

**Parameters**
- `id` (path) - Customer UUID

**Response**
```json
{
  "environments": [
    {
      "id": "uuid",
      "name": "alpha-qa-01",
      "type": "qa",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Planes

#### GET /api/planes

List all planes with their context configurations.

**Response**
```json
{
  "planes": [
    {
      "id": "uuid",
      "name": "App CI/CD",
      "slug": "app-cicd",
      "description": "Application build, test, and deployment pipelines",
      "contexts": [
        {
          "id": "uuid",
          "key": "pipeline_stage",
          "label": "Pipeline Stage",
          "fieldType": "single_select",
          "isRequired": true,
          "options": [
            { "value": "build", "label": "Build/Compile" },
            { "value": "test", "label": "Unit Tests" }
          ]
        }
      ]
    }
  ]
}
```

### Issues

#### POST /api/issues

Create a new issue.

**Request Body**
```json
{
  "customerId": "uuid",
  "environmentId": "uuid",
  "submitterHandle": "john.doe@company.com",
  "primaryPlaneId": "uuid",
  "secondaryPlaneIds": ["uuid", "uuid"],
  "title": "Pipeline timeout during deployment",
  "description": "Detailed description of the issue...",
  "pipelineUrl": "https://concourse.example.com/...",
  "contexts": [
    {
      "planeContextId": "uuid",
      "value": "deployment"
    }
  ]
}
```

**Response**
```json
{
  "issue": {
    "id": "uuid",
    "displayId": "ISS-2024-0847",
    "title": "Pipeline timeout during deployment",
    "status": "open",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /api/issues

List issues with optional filters.

**Query Parameters**
- `customerId` (optional) - Filter by customer
- `planeId` (optional) - Filter by plane
- `status` (optional) - Filter by status: open, in_progress, resolved, closed
- `startDate` (optional) - Filter by creation date (ISO 8601)
- `endDate` (optional) - Filter by creation date (ISO 8601)
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20, max: 100)

**Response**
```json
{
  "issues": [
    {
      "id": "uuid",
      "displayId": "ISS-2024-0847",
      "title": "Pipeline timeout during deployment",
      "status": "open",
      "customer": { "id": "uuid", "name": "Customer Alpha" },
      "environment": { "id": "uuid", "name": "alpha-qa-01", "type": "qa" },
      "primaryPlane": { "id": "uuid", "name": "App CI/CD" },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 127,
    "totalPages": 7
  }
}
```

#### GET /api/issues/:id

Get issue details.

**Response**
```json
{
  "issue": {
    "id": "uuid",
    "displayId": "ISS-2024-0847",
    "title": "Pipeline timeout during deployment",
    "description": "Full description...",
    "status": "open",
    "pipelineUrl": "https://...",
    "customer": { "id": "uuid", "name": "Customer Alpha" },
    "environment": { "id": "uuid", "name": "alpha-qa-01", "type": "qa" },
    "primaryPlane": { "id": "uuid", "name": "App CI/CD" },
    "secondaryPlanes": [],
    "contexts": [
      {
        "key": "pipeline_stage",
        "label": "Pipeline Stage",
        "value": "Application Deployment"
      }
    ],
    "submitterHandle": "john.doe@company.com",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PATCH /api/issues/:id

Update issue status or fields.

**Request Body**
```json
{
  "status": "in_progress"
}
```

**Response**
```json
{
  "issue": {
    "id": "uuid",
    "status": "in_progress",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### Documentation Search

#### POST /api/docs/search

Search documentation for relevant articles.

**Request Body**
```json
{
  "query": "pipeline timeout deployment",
  "planeSlug": "app-cicd",
  "limit": 5
}
```

**Response**
```json
{
  "results": [
    {
      "title": "How to Configure Pipeline Timeout Settings",
      "type": "how-to",
      "excerpt": "Learn how to adjust timeout values in your pipeline configuration...",
      "url": "https://happycloud.com/docs/app-cicd/how-to/configure-timeouts",
      "relevance": 0.92,
      "plane": "App CI/CD"
    }
  ]
}
```

### Documentation Feedback

#### POST /api/docs/feedback

Record feedback on documentation.

**Request Body**
```json
{
  "docUrl": "https://happycloud.com/docs/app-cicd/how-to/configure-timeouts",
  "docType": "how-to",
  "helpful": true,
  "issueId": "uuid",
  "context": {
    "planeSlug": "app-cicd",
    "customerId": "uuid"
  }
}
```

**Response**
```json
{
  "success": true,
  "feedbackId": "uuid"
}
```

### Chat (AI Conversation)

#### POST /api/chat

Stream AI chat responses.

**Request Body**
```json
{
  "messages": [
    { "role": "user", "content": "My deployment keeps timing out" }
  ]
}
```

**Response** (Streaming)
```
data: {"type":"text","content":"I understand you're experiencing..."}
data: {"type":"tool_call","name":"searchDocs","args":{"query":"deployment timeout"}}
data: {"type":"tool_result","content":[{"title":"...","url":"..."}]}
data: {"type":"text","content":"Based on your description..."}
data: [DONE]
```

### Analytics

#### GET /api/analytics/summary

Get dashboard summary statistics.

**Query Parameters**
- `startDate` (optional) - Start of date range
- `endDate` (optional) - End of date range

**Response**
```json
{
  "summary": {
    "totalIssues": 127,
    "openIssues": 23,
    "resolvedThisMonth": 42,
    "avgResolutionTime": 4.2,
    "selfResolutionRate": 0.23,
    "trends": {
      "issuesVsLastMonth": -12,
      "resolutionTimeVsLastMonth": -8,
      "selfResolutionVsLastMonth": 15
    }
  }
}
```

#### GET /api/analytics/planes

Get issue distribution by plane.

**Response**
```json
{
  "distribution": [
    {
      "plane": "App CI/CD",
      "count": 42,
      "changeVsLastMonth": 5
    }
  ]
}
```

#### GET /api/analytics/docs-effectiveness

Get documentation effectiveness metrics.

**Response**
```json
{
  "docs": [
    {
      "url": "https://happycloud.com/docs/...",
      "title": "How to Attach IAM Roles",
      "type": "how-to",
      "views": 45,
      "helpfulMarks": 18,
      "effectiveness": 0.40,
      "trend": "up"
    }
  ]
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      { "field": "title", "message": "Title is required" }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

| Endpoint Pattern | Rate Limit |
|-----------------|------------|
| `/api/chat` | 10 requests/minute |
| `/api/docs/search` | 30 requests/minute |
| All other endpoints | 100 requests/minute |

## Related Documents

- [Database Schema](/support-app/reference/database-schema/) - Data model
- [Infrastructure](/support-app/reference/infrastructure/) - Deployment config
- [Local Setup](/support-app/how-to/local-setup/) - Development environment
