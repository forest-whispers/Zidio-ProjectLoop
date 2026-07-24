# Database Design

LOOP uses **PostgreSQL** as its primary relational database with **Prisma ORM** for type-safe database access. The schema is designed around a multi-tenant architecture where every resource belongs to a workspace, ensuring complete tenant isolation.

In addition to relational data, the database supports **vector embeddings** through `pgvector`, enabling semantic search over customer feedback.

---

# Technology Stack

| Component | Technology |
|-----------|------------|
| Database | PostgreSQL |
| ORM | Prisma |
| Vector Storage | pgvector |
| Migrations | Prisma Migrate |
| Type Safety | Prisma Client |

---

# High-Level Schema

```text
                 Workspace
                     │
      ┌──────────────┼──────────────┐
      ▼                             ▼
     User                      Feedback
                                    │
                                    ▼
                              AI Analysis
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
               Embeddings                    Reports
```

---

# Core Entities

## Workspace

A workspace represents an independent organization using LOOP.

Each workspace owns:

- Users
- Feedback
- AI analysis
- Reports
- Analytics

All application queries are scoped by workspace.

---

## User

Users authenticate using NextAuth and belong to exactly one workspace.

Each user has:

- Profile information
- Role
- Authentication credentials
- Workspace membership

Supported roles include:

- Admin
- Analyst
- Viewer

Role-based authorization is enforced at the application layer.

---

## Feedback

The Feedback entity is the central object in the system.

Each record contains:

- Customer feedback content
- Source channel
- Status
- Customer label
- Sentiment
- Sentiment score
- Workspace reference
- Timestamps

Feedback can originate from:

- Manual entry
- CSV import
- Demo dataset
- External integrations (future)

---

## AI Analysis

Rather than storing raw LLM conversations, LOOP stores structured AI outputs.

Generated attributes include:

- Sentiment
- Themes
- Keywords
- Summary
- Confidence (future)

This structured approach enables efficient analytics and filtering.

---

## Embeddings

Every feedback document is converted into a vector embedding.

Embeddings are used exclusively for semantic retrieval and Retrieval-Augmented Generation (RAG).

Each embedding references exactly one feedback document.

---

## Reports

Reports are generated summaries built from analyzed feedback.

Reports may contain:

- Executive summaries
- Customer pain points
- Feature requests
- Product risks
- Positive feedback trends

Reports always belong to a workspace.

---

# Entity Relationships

```text
Workspace (1)
    │
    ├───────────────┐
    ▼               ▼
 Users (N)     Feedback (N)
                     │
                     │ 1
                     ▼
              AI Analysis (1)
                     │
                     │ 1
                     ▼
              Embedding (1)

Workspace (1)
      │
      ▼
 Reports (N)
```

---

# Multi-Tenant Design

The database follows a shared-database, shared-schema multi-tenant strategy.

Every tenant is identified through a `workspaceId`.

```text
Workspace
    │
    ├── User
    ├── Feedback
    ├── Report
    └── Analytics
```

Every application query filters data using the active workspace, preventing cross-tenant access.

---

# Data Flow

```text
Feedback Submitted
        │
        ▼
 PostgreSQL Storage
        │
        ▼
 AI Analysis
        │
        ▼
 Metadata Updated
        │
        ▼
 Embedding Generated
        │
        ▼
 Semantic Search Ready
```

---

# Indexing Strategy

The database is optimized for common application queries.

Primary indexes include:

- Workspace ID
- User ID
- Feedback status
- Feedback channel
- Created date
- Sentiment
- Foreign keys

Vector similarity searches are accelerated using pgvector indexes.

---

# Design Decisions

### PostgreSQL

Chosen for:

- ACID compliance
- strong relational modeling
- mature ecosystem
- excellent Prisma support

---

### Prisma ORM

Provides:

- type-safe queries
- schema migrations
- generated client
- improved developer productivity

---

### pgvector

Traditional SQL search relies on keywords.

pgvector enables semantic similarity search by comparing embeddings rather than exact text matches.

This allows users to discover related feedback even when different wording is used.

---

### Structured AI Metadata

Instead of repeatedly querying an LLM, LOOP persists structured AI outputs.

Benefits include:

- Faster analytics
- Better filtering
- Reduced AI costs
- Improved reporting
- Semantic retrieval

---

# Future Enhancements

Potential database improvements include:

- Full-text + vector hybrid search
- Partitioning for large datasets
- Background embedding generation
- Soft deletes
- Audit logs
- Event sourcing
- Read replicas
- Materialized views for analytics

---

# Summary

The database is designed around three core principles:

- **Relational integrity** using PostgreSQL
- **Type-safe access** through Prisma
- **Semantic intelligence** using pgvector

This architecture provides a scalable foundation for AI-powered customer feedback analysis while maintaining strong consistency, tenant isolation, and efficient querying.