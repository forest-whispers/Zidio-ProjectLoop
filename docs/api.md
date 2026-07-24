# 📚 API Reference

LOOP exposes a RESTful API organized around feature modules. Every endpoint follows a consistent response structure and role-based authorization model.

Base URL

```text
/api
```

---

# Authentication

Authentication is performed using **NextAuth v5 stateless session tokens stored in an HTTP-only cookie**.

Protected endpoints require a valid authenticated session.

Role-based authorization is enforced throughout the API handlers and service layer.

Supported roles:

- `ADMIN` (Workspace Owner / Administrator)
- `ANALYST` (Workspace Editor / Analyst)
- `VIEWER` (Workspace Viewer / Read-Only)

---

# Standard Response Format

Successful responses return the resource or response data directly as JSON along with the appropriate HTTP status code (e.g. `200 OK` or `201 Created`).

Successful JSON Resource Response

```json
{
  "id": "cm0123456789abcdefghij",
  "content": "The application interface is very intuitive...",
  "channel": "SURVEY",
  "customerLabel": "Enterprise Client",
  "status": "SUBMITTED",
  "workspaceId": "clw123456789abcdefghij",
  "createdAt": "2026-07-24T17:15:30.000Z",
  "updatedAt": "2026-07-24T17:15:30.000Z"
}
```

Successful responses with structured notification/message:

```json
{
  "message": "Account created successfully.",
  "user": {
    "id": "usr_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN"
  },
  "workspace": {
    "id": "ws_123",
    "name": "Acme Corp",
    "slug": "acme-corp"
  }
}
```

Error responses return the error message with the corresponding HTTP status code:

```json
{
  "message": "You do not have permission to perform this action."
}
```

---

# Role Access Matrix

| Module | VIEWER | ANALYST | ADMIN |
|--------|:------:|:-------:|:-----:|
| Authentication | ✅ | ✅ | ✅ |
| Users Profile | ✅ | ✅ | ✅ |
| Dashboard Data | ✅ | ✅ | ✅ |
| Analytics Metrics | ✅ | ✅ | ✅ |
| Ask Loop (Semantic Search) | ✅ | ✅ | ✅ |
| Executive Reports | ✅ | ✅ | ✅ |
| Feedback Read (List & Detail) | ✅ | ✅ | ✅ |
| Feedback Write (Create, Edit, Delete) | ❌ | ✅ | ✅ |
| Feedback Status Update | ❌ | ✅ | ✅ |
| Feedback Ingestion (CSV / Demo) | ❌ | ✅ | ✅ |
| AI Feedback Analysis | ❌ | ✅ | ✅ |

---

# API Modules

## Authentication

Base URL

```text
/api/auth
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /signup | Register a new user account (creates a workspace or joins one) |
| POST | /signin | NextAuth credentials authenticate and set session cookies |
| POST | /signout | Clear NextAuth session and sign out |

### POST `/signup`
Registers a new user and either creates a new workspace (under `"create"` mode) or joins an existing workspace (under `"join"` mode).

**Request Body (Create Workspace Mode)**:
```json
{
  "mode": "create",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "workspaceName": "Acme Corp"
}
```

**Request Body (Join Workspace Mode)**:
```json
{
  "mode": "join",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword",
  "workspaceSlug": "acme-corp",
  "role": "ANALYST"
}
```

**Response (201 Created)**:
```json
{
  "message": "Account created successfully.",
  "user": {
    "id": "usr_cuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN"
  },
  "workspace": {
    "id": "ws_cuid",
    "name": "Acme Corp",
    "slug": "acme-corp"
  }
}
```

---

## Users

Base URL

```text
/api/users
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /me | Retrieve currently authenticated user session details |

**Response (200 OK)**:
```json
{
  "user": {
    "id": "usr_cuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN",
    "workspace": {
      "id": "ws_cuid",
      "name": "Acme Corp",
      "slug": "acme-corp"
    }
  }
}
```

---

## Dashboard

Base URL

```text
/api/dashboard
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Retrieve overview metrics, member list, and recent activity for the workspace |

**Response (200 OK)**:
```json
{
  "overview": {
    "totalFeedback": 12,
    "analyzedFeedback": 10,
    "pendingAnalysis": 2,
    "activeThemes": 4,
    "workspaceMembers": 3
  },
  "members": [
    {
      "id": "usr_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN"
    }
  ],
  "recentFeedback": [
    {
      "id": "fb_123",
      "content": "The application interface is very intuitive...",
      "channel": "SURVEY",
      "createdAt": "2026-07-24T17:15:30.000Z"
    }
  ],
  "recentAnalyses": [
    {
      "id": "an_123",
      "analyzedAt": "2026-07-24T17:16:30.000Z",
      "summary": "Positive feedback regarding UI clarity.",
      "sentiment": "POSITIVE",
      "featureArea": "UI_UX",
      "feedbackId": "fb_123"
    }
  ]
}
```

---

## Analytics

Base URL

```text
/api/analytics
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Retrieve compiled feedback analysis statistics and trends |

### GET `/`
Returns computed feedback distributions, trends, negative feedback lists, and AI insights.

**Query Parameters**:
- `range` (optional): Filter metrics by time range. Supported values: `7d`, `30d`, `90d`, `1y`, `all`. Defaults to `30d`.

**Response (200 OK)**:
```json
{
  "overview": {
    "totalFeedback": 100,
    "analyzedFeedback": 80,
    "positivePercentage": 75,
    "negativePercentage": 10,
    "reviewedPercentage": 50,
    "activeThemes": 5
  },
  "volumeTrend": [
    {
      "date": "2026-07-24",
      "count": 5
    }
  ],
  "sentimentDistribution": [
    {
      "label": "POSITIVE",
      "value": 60,
      "percentage": 75
    }
  ],
  "featureAreaDistribution": [
    {
      "label": "DASHBOARD",
      "value": 20,
      "percentage": 25
    }
  ],
  "themeDistribution": [
    {
      "id": "th_123",
      "name": "Bugs",
      "color": "#ff0000",
      "count": 10,
      "percentage": 12.5
    }
  ],
  "channelDistribution": [
    {
      "label": "SUPPORT_TICKET",
      "value": 40,
      "percentage": 50
    }
  ],
  "statusDistribution": [
    {
      "label": "RESOLVED",
      "value": 50,
      "percentage": 62.5
    }
  ],
  "themeTrends": [
    {
      "id": "th_123",
      "name": "Bugs",
      "color": "#ff0000",
      "currentCount": 10,
      "previousCount": 5,
      "percentageChange": 100
    }
  ],
  "topNegativeFeedback": [
    {
      "id": "fb_123",
      "content": "Slow app performance on mobile devices.",
      "channel": "TWITTER",
      "createdAt": "2026-07-24T17:15:30.000Z",
      "sentimentScore": 0.95
    }
  ],
  "aiInsights": {
    "mostCommonComplaint": "Bugs",
    "mostPositiveArea": "DASHBOARD",
    "mostNegativeArea": "PERFORMANCE",
    "averageSentiment": 0.55
  },
  "newThisWeek": {
    "count": 5,
    "sentimentDistribution": []
  }
}
```

---

## Feedback

Base URL

```text
/api/feedback
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Retrieve list of feedback items with search, filters, and pagination |
| POST | / | Create a single feedback entry (requires `ADMIN` or `ANALYST`) |
| GET | /:id | Retrieve a specific feedback entry |
| PATCH | /:id | Update feedback details (requires `ADMIN` or `ANALYST`) |
| DELETE | /:id | Delete a feedback entry (requires `ADMIN` or `ANALYST`) |
| PATCH | /:id/status | Update feedback status (requires `ADMIN` or `ANALYST`) |
| POST | /import/csv | Import feedback via CSV upload (requires `ADMIN` or `ANALYST`) |
| POST | /import/demo | Seed mock demo feedback (requires `ADMIN` or `ANALYST`) |

### GET `/`
Lists feedback scoped to the authenticated workspace.

**Query Parameters**:
- `search` (optional): Filter feedback items containing this substring (case-insensitive).
- `channel` (optional): Filter by channel enum (`SUPPORT_TICKET`, `APP_STORE`, `PLAY_STORE`, `TWITTER`, `SALES_CALL`, `SURVEY`, `COMMUNITY`, `CSV_IMPORT`, `MANUAL`).
- `status` (optional): Filter by status enum (`SUBMITTED`, `UNDER_REVIEW`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
- `sentiment` (optional): Filter by sentiment enum (`POSITIVE`, `NEUTRAL`, `NEGATIVE`).
- `page` (optional): Integer (>=1). Defaults to `1`.
- `limit` (optional): Integer (1-100). Defaults to `20`.

**Response (200 OK)**:
```json
{
  "items": [
    {
      "id": "fb_cuid",
      "content": "The application interface is very intuitive...",
      "channel": "SURVEY",
      "customerLabel": "Enterprise Client",
      "status": "SUBMITTED",
      "workspaceId": "ws_cuid",
      "createdAt": "2026-07-24T17:15:30.000Z",
      "updatedAt": "2026-07-24T17:15:30.000Z",
      "themes": [
        {
          "feedbackId": "fb_cuid",
          "themeId": "th_cuid",
          "theme": {
            "id": "th_cuid",
            "name": "UX Clarity",
            "color": "#4f46e5"
          }
        }
      ],
      "analysis": {
        "id": "an_cuid",
        "feedbackId": "fb_cuid",
        "sentiment": "POSITIVE",
        "sentimentScore": 0.9,
        "summary": "Positive feedback regarding UI layout",
        "featureArea": "UI_UX",
        "keywords": ["layout", "intuitive"]
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

### POST `/`
Creates a new feedback item for the workspace.

**Request Body**:
```json
{
  "content": "The mobile app crash on signup.",
  "channel": "APP_STORE",
  "customerLabel": "Google Play Reviewer"
}
```

**Response (201 Created)**:
Returns the created feedback resource.

### PATCH `/:id`
Updates content, channel, or customerLabel fields on a feedback item.

**Request Body**:
```json
{
  "content": "Updated feedback text...",
  "channel": "PLAY_STORE"
}
```

**Response (200 OK)**:
Returns the updated feedback resource.

### DELETE `/:id`
Deletes a feedback item and cascade deletes related embeddings and analysis.

**Response (204 No Content)**:
Returns an empty response body.

### PATCH `/:id/status`
Updates only the processing status of a feedback item.

**Request Body**:
```json
{
  "status": "IN_PROGRESS"
}
```

**Response (200 OK)**:
Returns the updated feedback resource.

### POST `/import/csv`
Accepts a multipart file upload containing feedback records.

**Request Header**: `Content-Type: multipart/form-data`

**Form Body**:
- `file`: CSV file (must include columns `content`, `channel`, and optionally `customerLabel`).

**Response (200 OK)**:
```json
{
  "imported": 25,
  "failed": 2,
  "errors": [
    {
      "row": 4,
      "error": "content must be at least 5 characters long"
    }
  ]
}
```

### POST `/import/demo`
Seeds mock demo feedback records into the active workspace.

**Response (200 OK)**:
```json
{
  "imported": 15
}
```

---

## AI Analysis

Base URL

```text
/api/analysis
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /:feedbackId | Run or fetch semantic cache analysis on a single feedback item |
| POST | /workspace | Trigger sequential analysis on all unanalyzed workspace feedback items |

### POST `/:feedbackId`
Analyzes a feedback entry. Employs a semantic cache mechanism: if an identical or highly similar feedback embedding is found in the workspace database, its parsed analysis metadata is cloned rather than calling Gemini.

**Response (200 OK)**:
```json
{
  "id": "an_cuid",
  "feedbackId": "fb_cuid",
  "sentiment": "NEGATIVE",
  "sentimentScore": 0.85,
  "summary": "Mobile app suffers from launch crashes.",
  "featureArea": "MOBILE",
  "keywords": ["crashes", "mobile", "launch"],
  "provider": "google",
  "model": "gemini-1.5-flash",
  "processingTimeMs": 850,
  "cached": false,
  "analyzedAt": "2026-07-24T17:15:30.000Z",
  "createdAt": "2026-07-24T17:15:30.000Z",
  "updatedAt": "2026-07-24T17:15:30.000Z"
}
```

### POST `/workspace`
Finds up to 10 unanalyzed feedback entries in the workspace and analyzes them sequentially.

**Response (200 OK)**:
An array containing the generated `FeedbackAnalysis` objects.

---

## Ask Loop (Grounded QA & Semantic Search)

Base URL

```text
/api/ask-loop
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | / | Query the workspace feedback semantic search assistant |

### POST `/`
Submits a query to the AI grounded QA bot. This endpoint computes the question embedding, retrieves up to 8 matching feedback vectors via pgvector cosine distance similarity metric, and prompts the Gemini LLM to synthesize a citation-supported response.

**Request Body**:
```json
{
  "question": "What issues are users running into with billing?"
}
```

**Response (200 OK)**:
```json
{
  "answer": "Users are primarily reporting issues with invoice generation delays and payment method rejection...",
  "citations": [
    {
      "feedbackId": "fb_cuid",
      "similarity": 0.72,
      "content": "I couldn't pay with my credit card.",
      "summary": "Credit card payment failures",
      "sentiment": "NEGATIVE",
      "featureArea": "BILLING",
      "channel": "COMMUNITY",
      "themes": ["Billing", "Payments"]
    }
  ]
}
```

---

## Executive Reports

Base URL

```text
/api/report
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | / | Generate a structured AI executive product feedback report |

### POST `/`
Aggregates workspace metrics and representative feedback over a given range, sending a structured prompt to Gemini to synthesize an executive product feedback report in Markdown format.

**Request Body**:
```json
{
  "range": "90d"
}
```

**Response (200 OK)**:
```json
{
  "title": "Executive Product Feedback Report",
  "generatedAt": "2026-07-24T17:15:30.000Z",
  "range": "90d",
  "report": "# Executive Product Feedback Report\n\n## Overview\nOver the past 90 days, billing and mobile stability emerged as priority focus areas...\n"
}
```

---

# Pagination

Collection retrieval endpoints support offset pagination.

Query parameters:
```text
?page=1
&limit=20
```

Response structure:
```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 120,
    "totalPages": 6
  }
}
```

---

# Search & Filtering

Several endpoints support keyword searching and conditional filtering through query parameters.

Examples:
```text
GET /api/feedback?status=RESOLVED

GET /api/feedback?search=crash

GET /api/feedback?sentiment=NEGATIVE

GET /api/feedback?channel=TWITTER&page=2
```

---

# File Uploads

Multipart forms are used to submit CSV feedback files.

Endpoint:
- `POST /api/feedback/import/csv`

Files are parsed server-side using PapaParse, validated with Zod, and inserted in batches using Prisma.

---

# AI Processing & Search Pipeline

Ingestion & search flow within LOOP:

```text
                           Feedback Ingested
                                  │
                                  ▼
                         Generate Embedding
                      (text-embedding-004)
                                  │
                                  ▼
                    Check Semantic Analysis Cache
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
    [Cache Hit]                                       [Cache Miss]
Clone Existing Analysis                               Call Gemini LLM
                                               (sentiment, themes, summary)
         │                                                 │
         └────────────────────────┬────────────────────────┘
                                  ▼
                           Save Metadata &
                         Embedding (pgvector)
```

Similarity Search QA flow:
```text
                              User Query
                                  │
                                  ▼
                         Generate Embedding
                                  │
                                  ▼
                   Cosine Distance Similarity Search
                      (pgvector Match limit: 8)
                                  │
                                  ▼
                     Grounded LLM Prompt Build
                                  │
                                  ▼
                          Synthesized Answer
                           with Citations
```

---

# Error Handling

The API returns appropriate standard HTTP status codes.

| Status | Meaning | Description |
|--------|---------|-------------|
| 200 | Success | Request completed successfully |
| 201 | Resource Created | New resource created successfully |
| 204 | No Content | Action succeeded with no response body |
| 400 | Bad Request | Request validation or body payload format error |
| 401 | Unauthorized | Authentication session is missing or invalid |
| 403 | Forbidden | User role does not have permission for the action |
| 404 | Not Found | Requested resource or workspace could not be found |
| 409 | Conflict | Request conflicts with existing data (e.g. duplicate email) |
| 500 | Internal Server Error | An unexpected server error occurred |

---

# Future Enhancements

Planned API improvements include:

- Redis-backed response and embedding caching
- Background processing queues for large CSV uploads
- Real-time event streaming and updates via WebSockets
- Comprehensive OpenAPI/Swagger specification generation
- API Versioning framework (`/api/v1`)