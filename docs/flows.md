# Application Flows

This document describes the major workflows inside LOOP, from user authentication to AI-powered feedback analysis and report generation.

---

# Overview

The application is composed of several independent workflows that interact through well-defined interfaces.

```text
Authentication
      │
      ▼
Workspace Selection
      │
      ▼
Feedback Ingestion
      │
      ▼
AI Analysis
      │
      ▼
Embedding Generation
      │
      ▼
Analytics & Reports
      │
      ▼
Semantic Search
```

---

# 1. Authentication Flow

Users authenticate using NextAuth with credential-based authentication.

```text
User
 │
 ▼
Login Form
 │
 ▼
Credentials Validation
 │
 ▼
NextAuth
 │
 ▼
JWT Session Created
 │
 ▼
Redirect to Dashboard
```

### Steps

1. User submits email and password.
2. Credentials are validated.
3. User is authenticated.
4. JWT session is generated.
5. Workspace and role are attached to the session.
6. Protected routes become accessible.

---

# 2. Workspace Flow

Every authenticated user belongs to a workspace.

```text
User Login
     │
     ▼
Load Workspace
     │
     ▼
Attach workspaceId
     │
     ▼
Scope all requests
```

Every API request automatically operates within the active workspace.

This guarantees tenant isolation.

---

# 3. Feedback Ingestion Flow

Customer feedback may enter the system from multiple sources.

```text
               Feedback Sources
       ┌──────────┼─────────────┐
       ▼          ▼             ▼
 Manual Entry   CSV Upload   Demo Import
       │          │             │
       └──────────┼─────────────┘
                  ▼
          Input Validation
                  ▼
        Persist to PostgreSQL
                  ▼
       Trigger AI Processing
```

### Processing Steps

1. Validate input.
2. Normalize feedback.
3. Store in PostgreSQL.
4. Associate with workspace.
5. Queue for AI analysis.

---

# 4. AI Analysis Flow

Every feedback record passes through the AI pipeline.

```text
Feedback
    │
    ▼
Generate Prompt
    │
    ▼
Gemini API
    │
    ▼
Receive AI Response
    │
    ▼
Extract Structured Metadata
    │
    ▼
Update Database
```

The generated metadata includes:

- Sentiment
- Summary
- Themes
- Keywords

---

# 5. Embedding Generation Flow

Embeddings power semantic retrieval.

```text
Feedback
    │
    ▼
Embedding Model
    │
    ▼
Vector Generated
    │
    ▼
Store in pgvector
```

The stored embedding is linked to its feedback record.

---

# 6. Semantic Search Flow

Unlike keyword search, semantic search compares meaning.

```text
User Query
      │
      ▼
Generate Query Embedding
      │
      ▼
Vector Similarity Search
      │
      ▼
Top Matching Feedback
      │
      ▼
Display Results
```

This allows users to discover related feedback even when wording differs.

---

# 7. Dashboard Flow

The dashboard aggregates analyzed feedback into product insights.

```text
Feedback
      │
      ▼
Aggregate Data
      │
      ▼
Analytics Engine
      │
      ▼
Dashboard Widgets
```

Displayed insights include:

- Sentiment distribution
- Theme frequency
- Feedback trends
- Channel analytics

---

# 8. Executive Report Flow

Executive reports summarize analyzed customer feedback.

```text
Feedback
      │
      ▼
Retrieve AI Metadata
      │
      ▼
Aggregate Insights
      │
      ▼
Generate Report
      │
      ▼
Display Report
```

Reports focus on:

- Product risks
- Customer pain points
- Feature requests
- Positive feedback
- Recommended priorities

---

# 9. Authorization Flow

Every protected request follows the same authorization process.

```text
Incoming Request
        │
        ▼
Validate Session
        │
        ▼
Check Workspace
        │
        ▼
Verify User Role
        │
        ▼
Allow / Reject Request
```

Authorization is enforced before business logic executes.

---

# 10. Overall Request Lifecycle

The complete lifecycle of a feedback item is shown below.

```text
User
 │
 ▼
Create Feedback
 │
 ▼
Validation
 │
 ▼
PostgreSQL
 │
 ▼
AI Analysis
 │
 ▼
Embeddings
 │
 ▼
Analytics
 │
 ├──────────────► Dashboard
 │
 ├──────────────► Reports
 │
 └──────────────► Semantic Search
```

---

# Design Principles

These workflows follow several architectural principles:

- Authentication before authorization
- Workspace isolation on every request
- AI processing separated from ingestion
- Structured metadata instead of raw AI responses
- Semantic retrieval using vector embeddings
- Modular, feature-based architecture

Each workflow is intentionally independent, allowing future enhancements such as background workers, queues, streaming AI responses, and additional integrations without significant architectural changes.