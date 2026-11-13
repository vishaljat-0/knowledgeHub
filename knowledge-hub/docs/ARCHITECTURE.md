# Knowledge Hub — System Architecture

**Status:** Planning  
**Architecture decision:** Backend first; frontend starts only after backend APIs are implemented and tested.  
**Related documents:** `PRD.md`, `MVP-SCOPE.md`, `DEVELOPMENT-PLAN.md`, `API-CONTRACT.md`

## 1. System overview

Knowledge Hub is a web application with a React client and a Node.js/Express API. MongoDB stores user, conversation, message, and document metadata. The backend calls an LLM provider and an embedding provider through server-side service adapters. PDF text is extracted and split into chunks; embeddings are stored in a vector-search layer with metadata needed for ownership filtering and page citations.

```text
Browser
  |
  | HTTPS / JSON / multipart upload
  v
React client (frontend — after API freeze)
  |
  v
Node.js + Express API
  |-- Authentication middleware
  |-- Routes / Controllers
  |-- Application services
  |     |-- Conversation service
  |     |-- LLM service adapter
  |     |-- PDF upload + extraction service
  |     |-- Chunking + embedding service
  |     |-- Retrieval + RAG service
  |     |-- Document deletion service
  |
  |-- MongoDB (users, conversations, messages, document metadata)
  |-- File storage (uploaded PDF; provider TBD)
  |-- Vector search store (chunks + embeddings; provider TBD)
  |-- LLM / embedding APIs (provider/model TBD)
```

## 2. Technology baseline

| Layer | Planned technology | Notes |
|---|---|---|
| Frontend | React | Do not begin until backend APIs pass tests |
| Styling | Tailwind CSS | UI implementation detail |
| Backend | Node.js + Express | Primary application API |
| Database | MongoDB + Mongoose | User and application metadata |
| Authentication | Email/password + Google sign-in; JWT-protected APIs | Exact token transport/lifecycle to be finalized before auth implementation |
| API testing | Postman | Required before frontend integration |
| PDF upload | Multer or equivalent | Enforce 10 MB and verify actual file type |
| PDF extraction | Maintained PDF text-extraction library | Select and verify during implementation |
| LLM | One provider for MVP | Provider/model selected after checking current docs, cost, limits |
| Embeddings | Provider adapter | Embedding model selected with the LLM/provider decision |
| Vector search | Vector database/search layer | Provider TBD; must support metadata filters |
| File storage | Private storage | Provider TBD; never expose private files publicly |

## 3. Backend layering

Keep responsibilities separate:

- **Routes:** HTTP method, path, middleware, and controller mapping.
- **Controllers:** validate/normalize HTTP input and shape HTTP output.
- **Services:** application logic and orchestration.
- **Models/repositories:** MongoDB persistence and queries.
- **Middleware:** authentication, validation, upload limits, centralized errors.
- **Provider adapters:** LLM, embeddings, vector search, and file storage integrations.
- **Configuration:** environment variables and provider setup.

Typical request path:

`Route → middleware → controller → service → model/provider adapter → controller response`

Controllers must not contain prompt construction, vector-search implementation, or large PDF-processing logic.

## 4. Core data model

These are logical entities. Exact Mongoose schemas and indexes are implementation tasks.

### User
- `_id`
- `name`
- `email` (unique, normalized)
- `passwordHash` (absent for accounts that do not use password login, if supported by the chosen Google account model)
- `authProviders` / provider identifiers as needed
- `createdAt`, `updatedAt`

Never store plaintext passwords.

### Conversation
- `_id`
- `userId`
- `type`: `general` or `document`
- `title`
- `documentId` (required for document conversations; absent for general conversations)
- `createdAt`, `updatedAt`

Every read, update, and delete query must be scoped to the authenticated owner.

### Message
- `_id`
- `conversationId`
- `userId`
- `role`: `user` or `assistant`
- `content`
- `sources` (assistant document answers; empty/absent for general chat)
- `createdAt`

Do not store the PDF binary in message records.

### Document
- `_id`
- `userId`
- `conversationId`
- `originalFilename`
- `mimeType`
- `sizeBytes`
- private `storageKey` or storage reference
- `status`: `uploaded`, `processing`, `ready`, `failed`
- safe `failureCode` / `failureMessage` where useful
- page count and timestamps where available
- `createdAt`, `updatedAt`

### Vector chunk (logical record)
- `chunkId`
- `documentId`
- `conversationId`
- `userId`
- `text`
- `embedding`
- `pageNumber`
- `chunkIndex`
- metadata required for filtering and citation

The vector store must filter by the authenticated user's document/conversation scope. Never rely only on the client-supplied document ID.

## 5. General chat request lifecycle

1. Authenticate the user.
2. Validate the conversation ID and ownership, or create a conversation.
3. Persist the user message.
4. Load a bounded amount of prior conversation context.
5. Call the configured LLM through the LLM adapter.
6. Persist the assistant response.
7. Return the saved assistant message and conversation metadata.

Handle provider timeouts, rate limits, malformed responses, and usage/cost limits. Do not expose provider secrets or raw internal errors.

## 6. PDF ingestion and RAG lifecycle

1. Authenticate and authorize the user.
2. Accept one PDF file up to 10 MB.
3. Validate file content/type, not only the filename extension.
4. Create a document conversation and document metadata record.
5. Store the PDF in private file storage.
6. Mark the document `processing`.
7. Extract text page by page and preserve page numbers.
8. Reject or mark unsupported PDFs that have no usable embedded text (OCR is out of scope).
9. Split text into chunks while retaining page metadata.
10. Generate embeddings.
11. Store chunks/vectors with `userId`, `documentId`, `conversationId`, `pageNumber`, and `chunkIndex`.
12. Mark the document `ready`; on failure, mark `failed` and clean up partial artifacts where appropriate.
13. For a question, embed the question and retrieve relevant chunks filtered to that document and owner.
14. If no useful evidence is retrieved, return a safe no-context answer rather than inventing an answer.
15. Generate an answer from retrieved context and return source references derived from retrieved metadata.
16. Persist the user and assistant messages.

### RAG invariants

- Retrieval is scoped to the current user's document conversation.
- Page metadata survives extraction, chunking, retrieval, and response serialization.
- The model is instructed to answer from supplied context and say when evidence is insufficient.
- Citations are created from retrieved metadata, not generated freely by the model.
- PDF content is untrusted input; do not treat embedded instructions as system/developer instructions.

## 7. Deletion and consistency

Deleting a document conversation must remove:
- Associated PDF from private file storage.
- Vector chunks and embeddings.
- Document metadata.
- Conversation messages.
- Conversation metadata.

Deletion across multiple systems is not one atomic transaction. Implement an explicit cleanup strategy (for example, mark for deletion and retry failed cleanup steps). Do not report complete deletion if required cleanup has failed. Record safe operational errors without logging document contents or secrets.

Deleting a general conversation removes its messages and conversation metadata.

## 8. Security and reliability

- Use HTTPS in deployed environments.
- Store secrets only in environment variables or a secret manager.
- Hash passwords with a suitable password-hashing library.
- Validate all request bodies, IDs, and uploaded files.
- Enforce authentication and resource ownership on every protected operation.
- Apply request-size limits and sensible rate limits.
- Restrict CORS to configured frontend origins.
- Do not log passwords, tokens, API keys, or full private document contents.
- Keep file storage private and use safe generated storage names.
- Apply AI request and cost limits appropriate to the MVP.
- Return safe, consistent errors; never expose stack traces to clients.

## 9. Operational concerns

- Health endpoint reports API availability; database/provider readiness may be reported separately if implemented.
- Log request correlation IDs and safe error metadata.
- Monitor provider failures, ingestion failures, latency, and usage.
- Keep provider-specific code behind adapters to reduce lock-in.
- Keep a small fixed evaluation set (5–10 questions) for checking retrieval and answer quality.

## 10. Decisions intentionally left open

These are not silently assumed; select them before implementing the relevant subsystem:

1. LLM provider and model.
2. Embedding provider and model.
3. Vector database / vector-search implementation.
4. Private PDF storage provider.
5. PDF extraction library.
6. JWT transport, expiry, refresh, and revocation/logout strategy.
7. Whether ingestion is synchronous for the small MVP or uses a background job mechanism.

Choose based on current documentation, cost, limits, maintenance, and compatibility. Record the final choice here and in `.env.example` before implementation.
