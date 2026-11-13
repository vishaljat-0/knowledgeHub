# Knowledge Hub

Knowledge Hub is an AI-powered application that combines general AI
conversations with document-based conversations using
Retrieval-Augmented Generation (RAG).

## What problem does it address?

Users may want to ask general questions and also understand information
inside their own documents. Knowledge Hub brings both workflows into one
application and lets users revisit their conversations.

## MVP features

-   **General AI Chat:** Ask questions and receive LLM-generated answers
    with conversation context.
-   **Document Chat:** Upload one PDF and ask questions using a RAG
    pipeline.
-   **Source references:** Show where document-based answers came from.
-   **Chat history:** Reopen, continue, rename, and delete
    conversations.
-   **Authentication:** Email/password and Google OAuth.

## Proposed technology stack

-   Frontend: React + Tailwind CSS
-   Backend: Node.js + Express
-   Database: MongoDB
-   Authentication: Email/password + Google OAuth
-   File upload: Multer
-   AI: One LLM provider and one embedding model
-   Vector retrieval: MongoDB Atlas Vector Search (proposed)

Exact libraries and providers will be selected during technical design.

## Repository structure

``` text
knowledge-hub/
├── client/                  # React frontend (created after backend APIs)
├── server/                  # Node.js + Express backend
├── docs/
│   ├── PRD.md
│   └── MVP-SCOPE.md
├── README.md
└── .gitignore
```

## Development order

**Documentation → Backend → API testing → Frontend → Integration →
Testing and deployment**

The backend is intentionally built first. Its API contracts and core
endpoints will be tested with Postman before frontend implementation
begins.

## Project documentation

-   [`docs/PRD.md`](docs/PRD.md) --- Product requirements, user flows,
    acceptance criteria, risks, and architecture.
-   [`docs/MVP-SCOPE.md`](docs/MVP-SCOPE.md) --- Included and excluded
    features, constraints, and MVP completion test.

## MVP boundaries

-   One PDF per document conversation
-   Maximum PDF size: 10 MB
-   Authentication required
-   User waits until document processing completes
-   Deleting a document conversation deletes its PDF and associated
    vector/chunk data
-   No OCR, web search, multiple PDFs per chat, voice, agents, payments,
    or team collaboration in V1

## Current status

**Planning and scope definition.** Coding has not started.

## Getting started

Setup and run instructions will be added after the backend project is
created.
