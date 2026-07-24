# System Architecture

LOOP is an AI-powered customer feedback intelligence platform designed around a modular, feature-based architecture. Rather than coupling AI directly into the application, the system separates ingestion, analysis, storage, retrieval, and reporting into independent layers. This makes the platform easier to extend, test, and scale.

---

# High-Level Architecture

```text
                        Client (Browser)
                               │
                               ▼
                     Next.js App Router
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
 Authentication         Dashboard UI          API Routes
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               ▼
                     Business Service Layer
                               │
      ┌──────────────┬──────────┼──────────┬──────────────┐
      ▼              ▼          ▼          ▼              ▼
 Feedback      AI Engine    Analytics   Search      Reporting
                               │
                               ▼
                    Prisma ORM + PostgreSQL
                               │
                        pgvector Extension
                               │
                               ▼
                      Google Gemini API
```

---

# Core Components

The platform consists of six primary modules:

| Module | Responsibility |
|---------|----------------|
| Authentication | User authentication, authorization, session management |
| Feedback | Feedback ingestion, validation, CRUD operations |
| AI Engine | Sentiment analysis, theme extraction, summarization |
| Search | Semantic retrieval using vector embeddings |
| Analytics | Product insights and dashboards |
| Reports | AI-generated executive summaries |

Each module owns its own services, validation, business logic, and database interactions.

---

# Backend Architecture

The backend follows a feature-based architecture instead of a layered MVC structure.

```text
server/
├── modules/
│   ├── auth/
│   ├── feedback/
│   ├── analytics/
│   ├── reports/
│   └── ai/
│
├── db/
├── lib/
└── utils/
```

Each feature encapsulates:

- API handlers
- business logic
- validation
- database access
- utility functions

This minimizes coupling between unrelated modules.

---

# Frontend Architecture

The frontend is built with the Next.js App Router and React Server Components.

Responsibilities are divided into:

- Pages
- Feature components
- Shared UI components
- Hooks
- Providers
- API utilities

This keeps presentation logic independent from business logic.

---

# Authentication

Authentication is implemented using NextAuth v5 with JWT-based sessions.

Key characteristics include:

- Stateless authentication
- Protected server actions
- Workspace-aware authorization
- Role-based access control (RBAC)

Every authenticated request includes workspace information, ensuring proper tenant isolation.

---

# Feedback Ingestion Pipeline

Customer feedback can enter the system through multiple sources.

```text
Manual Entry
CSV Upload
Demo Import
      │
      ▼
Validation
      │
      ▼
Persistence
      │
      ▼
AI Processing Queue
```

Each feedback entry is normalized before being stored, allowing downstream AI processing to operate on a consistent schema.

---

# AI Processing Pipeline

Rather than storing raw LLM responses, LOOP extracts structured metadata from every feedback item.

```text
Feedback
    │
    ▼
Embedding Generation
    │
    ▼
LLM Analysis
    │
    ├── Sentiment
    ├── Themes
    ├── Keywords
    └── Summary
    │
    ▼
Structured Metadata
```

This enables analytics, filtering, semantic search, and reporting without repeatedly invoking the language model.

---

# Semantic Search

Every feedback document is converted into vector embeddings and stored using pgvector.

Search requests generate a query embedding and perform similarity search against stored vectors.

```text
User Query
     │
     ▼
Embedding
     │
     ▼
Vector Similarity Search
     │
     ▼
Relevant Feedback
```

Semantic retrieval allows discovery of related feedback even when different wording is used.

---

# Reporting & Analytics

Structured AI outputs are aggregated into dashboards and executive reports.

The reporting engine combines:

- sentiment trends
- recurring themes
- feedback volume
- customer segments

to generate concise summaries for product teams.

---

# Multi-Tenant Design

LOOP is designed as a multi-tenant application.

Every resource belongs to a workspace.

```text
Workspace
    ├── Users
    ├── Feedback
    ├── Reports
    ├── Analytics
    └── Embeddings
```

All database queries are scoped by workspace to prevent cross-tenant data access.

---

# Security Considerations

The platform incorporates several security measures:

- JWT session authentication
- Protected API routes
- Server-side authorization
- Role-based permissions
- Input validation with Zod
- Type-safe database access through Prisma

---

# Scalability Considerations

The architecture is intentionally designed for future scaling.

Potential improvements include:

- Redis caching
- Background job queues
- Streaming AI responses
- Distributed workers
- Hybrid semantic search
- Incremental embedding generation

Because business modules remain isolated, these enhancements can be introduced with minimal changes to existing code.

---

# Architectural Principles

The architecture follows several guiding principles:

- Feature-first organization
- Separation of concerns
- Strong type safety
- AI as an infrastructure layer
- Multi-tenant isolation
- Modular and extensible design

These principles make LOOP easier to maintain, extend, and evolve as additional AI capabilities are introduced.