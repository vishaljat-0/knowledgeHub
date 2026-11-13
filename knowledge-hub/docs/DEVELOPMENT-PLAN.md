# Knowledge Hub --- Development Plan

**Development order:** Backend first → API testing → Frontend →
Integration → Final testing and deployment\
**Project status:** Planning document\
**Rule:** Complete and verify the current task before moving to the next
task. Do not build the frontend until the backend APIs are implemented
and tested.

------------------------------------------------------------------------

## 1. How to use this plan

For every task:

1.  Read the task and understand its purpose.
2.  Identify the concept you need to learn.
3.  Implement only that task.
4.  Test it using the stated expected result.
5.  Mark it complete only when the test passes.
6.  If stuck, write down the error and what you tried before moving on.

**Completion rule:** A task is complete only when you can explain what
it does, why it is needed, and demonstrate that it works.

------------------------------------------------------------------------

# Part A --- Backend development

## Phase 1 --- Backend foundation

**Goal:** Create a working Express backend connected to MongoDB.

### Task 1.1 --- Create the backend project

-   [ ] Create a `backend` folder.
-   [ ] Initialize the Node.js project with `npm init`.
-   [ ] Install Express and the development dependencies you need.
-   [ ] Create the initial server entry point.
-   [ ] Add a development script.

**Learn:** Node.js project structure, `package.json`, npm scripts, ES
modules or CommonJS (choose one module system and use it consistently).

**Expected result:** The backend starts with one command and does not
crash.

**Verify:** Start the server and confirm the expected startup message
appears.

### Task 1.2 --- Create a basic Express server

-   [ ] Create the Express app.
-   [ ] Add JSON request parsing.
-   [ ] Add a basic health-check route, such as `GET /api/health`.
-   [ ] Add a not-found handler.
-   [ ] Add a centralized error handler.

**Learn:** Express middleware, request/response cycle, routing, HTTP
status codes, error handling.

**Expected result:** The health endpoint returns a small JSON response.

**Verify with Postman:** Send `GET /api/health` and confirm a successful
status and JSON response.

### Task 1.3 --- Connect MongoDB

-   [ ] Create a MongoDB database.
-   [ ] Store the connection string in an environment variable.
-   [ ] Add environment-variable loading.
-   [ ] Create a separate database connection module.
-   [ ] Connect to MongoDB when the server starts.
-   [ ] Handle connection failures clearly.

**Learn:** MongoDB, Mongoose, environment variables, database connection
lifecycle.

**Expected result:** The server connects to the intended database and
reports connection errors clearly.

**Verify:** Start the server and confirm the database connection
succeeds. Never commit `.env`.

### Task 1.4 --- Establish backend structure

-   [ ] Create folders for routes, controllers, models, middleware,
    services, and configuration.
-   [ ] Keep route definitions separate from business logic.
-   [ ] Keep external-provider logic in service modules.
-   [ ] Add a consistent response and error convention.

**Learn:** Separation of concerns, MVC-style organization, service
layer.

**Expected result:** A small feature can be followed from route →
controller → service/model without confusing responsibilities.

**Verify:** Review one sample route and explain the role of each layer.

------------------------------------------------------------------------

## Phase 2 --- Authentication and user security

**Goal:** Users must authenticate before using Knowledge Hub.

### Task 2.1 --- Define the User model

-   [ ] Define the required user fields.
-   [ ] Add validation and unique constraints where appropriate.
-   [ ] Store password hashes, never plain-text passwords.
-   [ ] Add timestamps.

**Learn:** Mongoose schemas, validation, indexes, password hashing.

**Expected result:** A valid user can be represented and saved safely.

**Verify:** Test valid and invalid user data. Confirm duplicate email is
rejected.

### Task 2.2 --- Build registration

-   [ ] Define the registration API contract.
-   [ ] Validate incoming fields on the backend.
-   [ ] Hash the password.
-   [ ] Create the user.
-   [ ] Return a safe user response without the password hash.

**Learn:** Request validation, async controller logic, password hashing,
HTTP errors.

**Expected result:** A user can register, and the password is never
stored as plain text.

**Verify with Postman:** Test successful registration, missing fields,
invalid email, weak password according to your chosen rules, and
duplicate email.

### Task 2.3 --- Build login and session/token handling

-   [ ] Define the login API contract.
-   [ ] Find the user by email.
-   [ ] Compare the submitted password with the stored hash.
-   [ ] Issue the chosen authentication credential.
-   [ ] Decide and document the storage and transport strategy for that
    credential.
-   [ ] Add logout behavior appropriate to the chosen strategy.

**Learn:** Authentication vs authorization, password comparison, JWT or
cookie-based sessions, secure cookie settings, CSRF considerations.

**Expected result:** Correct credentials authenticate; incorrect
credentials do not.

**Verify with Postman:** Test valid login, wrong password, unknown
email, and logout.

### Task 2.4 --- Protect routes and enforce ownership

-   [ ] Create authentication middleware.
-   [ ] Add a protected test endpoint.
-   [ ] Attach the authenticated user identity to the request.
-   [ ] Ensure database queries are scoped to the authenticated user.
-   [ ] Return appropriate unauthorized/forbidden responses.

**Learn:** Middleware, identity, authorization, IDOR prevention, data
isolation.

**Expected result:** A user cannot access another user's records by
changing an ID.

**Verify:** Test requests with no credential, an invalid credential, and
two different users.

### Task 2.5 --- Add Google OAuth

-   [ ] Register the application with the chosen Google OAuth
    configuration.
-   [ ] Configure callback URLs and environment variables.
-   [ ] Implement the OAuth flow using a maintained library/provider
    approach.
-   [ ] Link or create the correct user account safely.
-   [ ] Handle cancelled or failed OAuth attempts.

**Learn:** OAuth 2.0 / OpenID Connect at a practical level, redirect
flow, callback validation, account linking.

**Expected result:** A user can sign in with Google and receive the same
authenticated application experience.

**Verify:** Test successful sign-in, cancelled sign-in, and
account-linking edge cases.

------------------------------------------------------------------------

## Phase 3 --- General AI chat backend

**Goal:** Authenticated users can create, continue, and save general AI
conversations.

### Task 3.1 --- Design conversation and message models

-   [ ] Define a Conversation model.
-   [ ] Define a Message model or an appropriate message-storage design.
-   [ ] Store conversation type as `general` or `document`.
-   [ ] Store ownership on every conversation.
-   [ ] Store message role, content, timestamps, and any required
    provider metadata.
-   [ ] Add indexes for common user-history queries.

**Learn:** Data modeling, references vs embedded documents, indexes,
pagination.

**Expected result:** Conversations and their messages can be stored and
queried by their owner.

**Verify:** Create test records and confirm one user cannot query
another user's records.

### Task 3.2 --- Create and list general conversations

-   [ ] Build the create-conversation endpoint.
-   [ ] Build the list-conversations endpoint.
-   [ ] Return only the authenticated user's conversations.
-   [ ] Add pagination or a defined result limit.

**Learn:** REST design, query filters, pagination, authorization.

**Expected result:** An authenticated user can create a general
conversation and see their own conversation list.

**Verify with Postman:** Test create, list, empty list, and cross-user
isolation.

### Task 3.3 --- Integrate one LLM provider

-   [ ] Choose one provider after comparing current API documentation,
    pricing, rate limits, and data policies.
-   [ ] Store the API key securely in environment variables.
-   [ ] Create a dedicated LLM service module.
-   [ ] Send a simple prompt to the provider.
-   [ ] Handle timeout, rate-limit, and provider errors.
-   [ ] Set reasonable input/output limits for the MVP.

**Learn:** LLM API requests, tokens, context windows, temperature,
timeouts, retries, cost controls.

**Expected result:** The backend can send a prompt to the selected model
and receive a response.

**Verify:** Test a normal request and simulate or safely handle a
provider failure.

### Task 3.4 --- Implement message sending with conversation context

-   [ ] Build the send-message endpoint.
-   [ ] Verify conversation ownership.
-   [ ] Save the user's message.
-   [ ] Load the relevant previous messages in the conversation.
-   [ ] Construct the model input within a defined context limit.
-   [ ] Call the LLM service.
-   [ ] Save the assistant response.
-   [ ] Return the saved response to the client.

**Learn:** Conversation history, prompt construction, token budgeting,
sequential async operations.

**Expected result:** Follow-up questions can use earlier messages from
the same conversation.

**Verify:** Ask a question, then ask a follow-up that depends on it.
Confirm the answer uses the prior context.

### Task 3.5 --- Add conversation management

-   [ ] Build get-conversation-with-messages.
-   [ ] Build rename-conversation.
-   [ ] Build delete-conversation.
-   [ ] Enforce ownership on every operation.
-   [ ] Define safe behavior if deletion partially fails.

**Learn:** CRUD, cascading deletion, consistency, authorization.

**Expected result:** Users can reopen, rename, and delete their own
general conversations.

**Verify:** Test each operation and test access using a second user.

------------------------------------------------------------------------

## Phase 4 --- PDF upload and text extraction

**Goal:** Accept one valid PDF of up to 10 MB for a document
conversation.

### Task 4.1 --- Define document metadata

-   [ ] Define the document metadata fields.
-   [ ] Link the document to its conversation and owner.
-   [ ] Track processing status, such as `uploaded`, `processing`,
    `ready`, or `failed`.
-   [ ] Store file metadata and storage location, not the PDF binary
    inside ordinary conversation messages.

**Learn:** File metadata, document lifecycle, status modeling.

**Expected result:** The backend can track a document and its processing
state.

**Verify:** Create and retrieve document metadata for the correct owner.

### Task 4.2 --- Implement secure PDF upload

-   [ ] Choose file storage for the MVP.
-   [ ] Configure Multer or an equivalent upload handler.
-   [ ] Enforce the 10 MB limit on the backend.
-   [ ] Validate the PDF type using more than the filename extension.
-   [ ] Generate safe storage names.
-   [ ] Associate the upload with a new or existing document
    conversation.
-   [ ] Clean up files when database creation fails.

**Learn:** Multipart form data, Multer, file validation, upload
security, storage trade-offs.

**Expected result:** Valid PDFs are accepted; oversized and non-PDF
files are rejected.

**Verify with Postman:** Test a valid PDF, a file above 10 MB, a non-PDF
file renamed to `.pdf`, and a missing file.

### Task 4.3 --- Extract PDF text and page information

-   [ ] Select a maintained PDF text-extraction library.
-   [ ] Extract text from each page.
-   [ ] Preserve page numbers in the extracted representation.
-   [ ] Detect empty or unusable text.
-   [ ] Handle encrypted, malformed, and unsupported PDFs.
-   [ ] Mark scanned/image-only PDFs as unsupported in V1.

**Learn:** PDF structure, text extraction, page metadata, parsing
failures.

**Expected result:** A text-based PDF produces extracted text with page
mapping.

**Verify:** Test a normal multi-page PDF, an empty-text/scanned PDF, and
a malformed or protected PDF.

------------------------------------------------------------------------

## Phase 5 --- RAG pipeline

**Goal:** Turn document text into searchable chunks and retrieve
relevant evidence for questions.

### Task 5.1 --- Design the chunk data model

-   [ ] Decide what each chunk record must contain.
-   [ ] Include document ID, owner ID, chunk text, page number, chunk
    order, and embedding.
-   [ ] Decide how document deletion will remove its chunks.
-   [ ] Define indexes needed for filtering.

**Learn:** Chunk metadata, vector data, filtering, data lifecycle.

**Expected result:** Every chunk can be traced to its source document
and page.

**Verify:** Inspect sample chunk records and confirm metadata is
complete.

### Task 5.2 --- Implement text chunking

-   [ ] Choose a chunking strategy.
-   [ ] Set an initial chunk size and overlap based on the
    embedding/model constraints.
-   [ ] Keep page references attached to chunks.
-   [ ] Avoid producing empty chunks.
-   [ ] Test long pages and short pages.

**Learn:** Tokens vs characters, chunk size, overlap, semantic
boundaries, retrieval trade-offs.

**Expected result:** Extracted PDF text becomes manageable chunks with
source-page metadata.

**Verify:** Inspect chunk boundaries and confirm no source page mapping
is lost.

### Task 5.3 --- Integrate one embedding model

-   [ ] Choose one embedding model after checking current documentation,
    dimensions, pricing, limits, and availability.
-   [ ] Create an embedding service module.
-   [ ] Generate embeddings for document chunks.
-   [ ] Handle batching, rate limits, and failures.
-   [ ] Record the model name and vector dimensions in
    configuration/documentation.

**Learn:** Embeddings, vector dimensions, semantic similarity, batching.

**Expected result:** Each chunk has a valid vector of the expected
dimension.

**Verify:** Generate vectors for sample chunks and confirm dimensions
are consistent.

### Task 5.4 --- Store vectors and configure vector search

-   [ ] Confirm the chosen vector database/search technology.
-   [ ] If using MongoDB Atlas Vector Search, confirm the selected
    cluster tier supports the required capability.
-   [ ] Create the required vector index.
-   [ ] Store chunk text, vector, and metadata.
-   [ ] Filter searches by document and authenticated owner.

**Learn:** Vector indexes, similarity search, metadata filters, database
capability limits.

**Expected result:** A query can retrieve chunks only from the correct
document and user.

**Verify:** Run a sample vector search and test cross-document and
cross-user isolation.

### Task 5.5 --- Build the document processing pipeline

-   [ ] Connect upload → extraction → chunking → embeddings → vector
    storage.
-   [ ] Update document processing status at each stage.
-   [ ] Handle partial failures and clean up incomplete data.
-   [ ] Do not allow document chat until status is `ready`.
-   [ ] Return clear processing errors to the client.

**Learn:** Pipeline orchestration, async workflows, retries,
idempotency, cleanup.

**Expected result:** A valid PDF reaches `ready`; unsupported or failed
files reach `failed` with a useful error.

**Verify:** Test the full pipeline with a small PDF and test at least
one failure case.

------------------------------------------------------------------------

## Phase 6 --- Document chat

**Goal:** Answer questions using retrieved PDF evidence, not unsupported
guesses.

### Task 6.1 --- Embed the user's question and retrieve chunks

-   [ ] Validate the conversation and document ownership.
-   [ ] Embed the user's question with the same embedding model.
-   [ ] Search only the conversation's document.
-   [ ] Apply an initial result limit and relevance threshold.
-   [ ] Keep source page metadata with every retrieved chunk.

**Learn:** Query embeddings, top-k retrieval, similarity thresholds,
metadata filtering.

**Expected result:** A question retrieves relevant chunks from the
uploaded PDF.

**Verify:** Ask a question whose answer is clearly present and inspect
the retrieved source chunks.

### Task 6.2 --- Build grounded answer generation

-   [ ] Construct a prompt with retrieved context and the user's
    question.
-   [ ] Instruct the model to answer only from the supplied document
    context.
-   [ ] Require it to say when the evidence is insufficient.
-   [ ] Ask the model to provide source references using the supplied
    page metadata.
-   [ ] Validate or normalize the returned source references.

**Learn:** RAG prompting, grounding, hallucination risks, citation
validation.

**Expected result:** Answers use document evidence and identify source
pages where possible.

**Verify:** Test a supported question and a question whose answer is
absent from the PDF.

### Task 6.3 --- Save document-chat messages and follow-ups

-   [ ] Reuse the message persistence pattern from general chat where
    appropriate.
-   [ ] Keep document context tied to the same conversation.
-   [ ] Ensure follow-up retrieval still searches the correct PDF.
-   [ ] Save assistant responses and source references.

**Learn:** Reusing services, conversation state, source traceability.

**Expected result:** Users can ask follow-up questions about the same
PDF.

**Verify:** Ask two related questions and confirm both use the correct
document.

------------------------------------------------------------------------

## Phase 7 --- History, deletion, and backend hardening

**Goal:** Finish backend behavior before frontend development.

### Task 7.1 --- Complete conversation history APIs

-   [ ] List conversations with type, title, and timestamps.
-   [ ] Retrieve one conversation with messages.
-   [ ] Rename a conversation.
-   [ ] Delete a conversation.
-   [ ] Return stable, documented response shapes.

**Verify:** Test general and document conversations, pagination, and
ownership.

### Task 7.2 --- Implement document-chat deletion

-   [ ] Delete the stored PDF.
-   [ ] Delete document chunks and vectors.
-   [ ] Delete document metadata.
-   [ ] Delete related messages and conversation.
-   [ ] Define retry/reconciliation behavior if one deletion step fails.

**Learn:** Cascading deletion, consistency, cleanup jobs/manual
recovery.

**Expected result:** Deleting a document conversation removes its
associated data according to the documented policy.

**Verify:** Check storage, database metadata, chunks, and messages after
deletion.

### Task 7.3 --- Add security and reliability checks

-   [ ] Validate request bodies, parameters, and uploaded files.
-   [ ] Add request size limits and sensible rate limits.
-   [ ] Avoid exposing stack traces or secrets.
-   [ ] Add safe logging without logging passwords, tokens, or sensitive
    document contents.
-   [ ] Review CORS and allowed origins.
-   [ ] Review authentication, authorization, and user-data isolation.
-   [ ] Add AI usage and cost limits appropriate for the MVP.

**Verify:** Run negative tests and review logs and error responses.

------------------------------------------------------------------------

## Phase 8 --- Backend API testing and freeze

**Goal:** The backend is usable and stable before React development
begins.

### Task 8.1 --- Create a Postman collection

-   [ ] Add environment variables for the API base URL and
    authentication.
-   [ ] Add health-check requests.
-   [ ] Add registration, login, OAuth-related test notes, and
    protected-route requests.
-   [ ] Add general-chat requests.
-   [ ] Add PDF upload and document-processing requests.
-   [ ] Add document-chat requests.
-   [ ] Add history, rename, and delete requests.
-   [ ] Add negative and authorization tests.

### Task 8.2 --- Verify acceptance criteria

-   [ ] A user can register and log in.
-   [ ] Protected endpoints reject unauthenticated requests.
-   [ ] Users cannot access another user's data.
-   [ ] General chat saves messages and supports follow-ups.
-   [ ] A valid PDF up to 10 MB can be uploaded.
-   [ ] Invalid and unsupported PDFs are rejected with clear errors.
-   [ ] Document processing reaches a clear `ready` or `failed` state.
-   [ ] Document questions retrieve relevant chunks from the correct
    PDF.
-   [ ] Answers can say when evidence is missing.
-   [ ] Source references map to the extracted page metadata.
-   [ ] History, rename, and deletion work.
-   [ ] Deleting a document chat removes its associated file and vector
    data.

`<badge>`{=html}Backend completion gate`</badge>`{=html}

**Do not start frontend implementation until the API collection passes
the acceptance tests above, or any remaining failures are explicitly
documented and agreed as deferred.**

------------------------------------------------------------------------

# Part B --- Frontend development

## Phase 9 --- React foundation

**Goal:** Set up the client only after the backend API contracts are
stable.

### Task 9.1 --- Create the frontend project

-   [ ] Create the React app using the selected build tool.
-   [ ] Configure Tailwind CSS.
-   [ ] Add routing.
-   [ ] Create a shared API client.
-   [ ] Configure the backend base URL using environment variables.
-   [ ] Add a consistent loading and error display pattern.

**Learn:** React project structure, routing, environment variables, API
clients.

**Verify:** The app starts and can call the backend health endpoint.

### Task 9.2 --- Build authentication screens

-   [ ] Registration page.
-   [ ] Login page.
-   [ ] Google sign-in entry point.
-   [ ] Protected-route behavior.
-   [ ] Logout behavior.
-   [ ] Loading and validation errors.

**Verify:** Complete registration/login/logout flows against the tested
backend.

------------------------------------------------------------------------

## Phase 10 --- General chat interface

-   [ ] Build the dashboard shell.
-   [ ] Add the New General Chat action.
-   [ ] Build the conversation list.
-   [ ] Build the message display.
-   [ ] Build the message composer.
-   [ ] Connect create, list, open, send, rename, and delete APIs.
-   [ ] Show loading, empty, and error states.
-   [ ] Preserve follow-up conversation context.

**Verify:** Complete a full general-chat journey in the browser.

------------------------------------------------------------------------

## Phase 11 --- Document chat interface

-   [ ] Add the New Document Chat action.
-   [ ] Build the PDF upload UI.
-   [ ] Show the 10 MB limit and PDF-only rule.
-   [ ] Show processing status and errors.
-   [ ] Disable document questions until processing is ready.
-   [ ] Build the document-chat message interface.
-   [ ] Display source page references.
-   [ ] Connect document history and deletion.

**Verify:** Upload a PDF, wait for processing, ask questions, inspect
sources, and delete the document conversation.

------------------------------------------------------------------------

## Phase 12 --- Integration, testing, and deployment

### Task 12.1 --- End-to-end testing

-   [ ] Test registration through document chat.
-   [ ] Test general chat through reopening a saved conversation.
-   [ ] Test two users and verify data isolation.
-   [ ] Test refresh/reopen behavior.
-   [ ] Test mobile and desktop layouts.
-   [ ] Test loading, empty, validation, and server-error states.

### Task 12.2 --- Deployment preparation

-   [ ] Choose hosting for the frontend and backend.
-   [ ] Configure production environment variables.
-   [ ] Configure production database access.
-   [ ] Configure OAuth callback URLs for production.
-   [ ] Configure file storage permissions and limits.
-   [ ] Configure CORS for production domains.
-   [ ] Add basic monitoring and error logging.
-   [ ] Document deployment and rollback steps.

**Expected result:** A deployed MVP with working authentication, general
chat, and document chat.

------------------------------------------------------------------------

# Recommended implementation rules

1.  Build one small task at a time.
2.  Do not copy code without understanding it.
3.  Prefer official documentation for library and provider decisions.
4.  Do not choose an LLM, embedding model, PDF library, or vector-search
    setup based on old tutorials alone; verify current documentation,
    pricing, limits, and compatibility before implementation.
5.  Keep secrets in environment variables and out of Git.
6.  Test each API in Postman before connecting it to React.
7.  Use realistic test PDFs, including multi-page files and files with
    no extractable text.
8.  Record decisions and changes in the relevant documentation.
9.  Keep the V1 scope small. Do not add out-of-scope features while core
    flows are incomplete.
10. Mark a task complete only after its verification step passes.

## Suggested progress log

For each task, record:

-   **Task:**
-   **Status:** Not started / In progress / Blocked / Tested
-   **What I learned:**
-   **What I implemented:**
-   **Test performed:**
-   **Result:**
-   **Question or blocker:**

------------------------------------------------------------------------

## First task to start

Start with **Task 1.1 --- Create the backend project**.

Do not install every possible library at once. First create the Node.js
project, inspect `package.json`, and understand the purpose of each
script and dependency. Then verify that the project runs before moving
to the Express server.
