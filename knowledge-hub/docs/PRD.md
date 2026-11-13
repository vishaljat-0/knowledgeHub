# Knowledge Hub --- Product Requirements Document

**Version:** 1.0\
**Status:** MVP scope finalized\
**Product type:** AI-powered chat and document assistant

## 1. Product overview

Knowledge Hub is an AI-powered platform that brings general AI
conversations and document-based AI conversations into one application.

**Value proposition:** One place for general AI chat and document-based
AI chat.

**Initial target audience:** General users. This is a broad starting
position, not validated market demand. The MVP focuses on two clear
workflows rather than trying to optimize for every audience.

## 2. Problem statement

Users may want to ask general questions and also understand information
inside their own documents. These workflows are often handled in
separate places. Knowledge Hub aims to bring both into one simple
interface and let users revisit their conversations.

## 3. MVP goals

1.  A registered user can have a general AI conversation.
2.  A registered user can upload one PDF in a document conversation and
    ask questions grounded in that PDF using RAG.
3.  Document-chat answers can display source references.
4.  Users can save, revisit, rename, and delete conversations.
5.  Users can access and manage only their own data.

### MVP success criteria

The MVP is functionally successful when a user can: - Register or sign
in. - Start a general chat and receive contextual follow-up answers. -
Start a document chat, upload a supported PDF, wait for processing, and
ask questions. - Receive document-grounded answers with source
references. - Reopen, continue, rename, and delete conversations.

## 4. Users and authentication

Authentication is required before accessing application features.

Supported authentication methods: - Email and password - Google OAuth

Security requirements: - Passwords must be securely hashed. - Google
authentication must be verified by the backend. - Protected pages and
API routes must require authentication. - Every user-owned resource must
be checked for ownership on the backend. - A user must not be able to
access another user's conversations, documents, messages, or vectors.

## 5. Functional requirements

### 5.1 Authentication

  ID        Requirement
  --------- --------------------------------------------------------
  AUTH-01   A user can register with name, email, and password.
  AUTH-02   A user can sign in with email and password.
  AUTH-03   A user can sign in using Google OAuth.
  AUTH-04   A user can log out.
  AUTH-05   Protected pages and API routes require authentication.
  AUTH-06   The backend enforces ownership of user-specific data.

### 5.2 General AI chat

  -----------------------------------------------------------------------
  ID                                  Requirement
  ----------------------------------- -----------------------------------
  CHAT-01                             A user can create a new general
                                      conversation.

  CHAT-02                             A user can send text messages.

  CHAT-03                             The backend sends the message to an
                                      LLM and displays its response.

  CHAT-04                             Follow-up questions use relevant
                                      previous messages from the same
                                      conversation as context.

  CHAT-05                             A user can reopen and continue an
                                      existing conversation.

  CHAT-06                             Conversations and messages are
                                      saved.

  CHAT-07                             The interface displays loading,
                                      empty, and error states.
  -----------------------------------------------------------------------

The backend should send a suitable portion of conversation history with
each request and account for model context-window and token limits.

### 5.3 Document chat (RAG)

**Scope: one PDF per document conversation. Maximum file size: 10 MB.**

  -----------------------------------------------------------------------
  ID                                  Requirement
  ----------------------------------- -----------------------------------
  DOC-01                              A user can create a new document
                                      conversation.

  DOC-02                              A user can upload one PDF up to 10
                                      MB.

  DOC-03                              The backend validates file type and
                                      size.

  DOC-04                              The backend extracts text from the
                                      PDF.

  DOC-05                              Extracted text is divided into
                                      chunks.

  DOC-06                              The application generates
                                      embeddings for chunks.

  DOC-07                              Chunk text, metadata, and vectors
                                      are stored for retrieval.

  DOC-08                              A user question is embedded for
                                      similarity search.

  DOC-09                              The application retrieves relevant
                                      chunks from that PDF.

  DOC-10                              Retrieved context and the question
                                      are sent to the LLM.

  DOC-11                              The answer is displayed with source
                                      references where available.

  DOC-12                              The user can ask follow-up
                                      questions about the same PDF.

  DOC-13                              If relevant evidence is not found,
                                      the assistant communicates that
                                      limitation instead of inventing
                                      document content.
  -----------------------------------------------------------------------

#### Document processing behavior

-   After upload, show **"Processing document..."**.
-   The user can ask questions only after processing succeeds.
-   For V1, the user waits for processing to complete. Background jobs
    and notifications are out of scope.
-   If extraction, embedding, or storage fails, show an error and do not
    mark the document as ready.
-   Scanned PDFs without extractable text may not work in V1. OCR is out
    of scope.

### 5.4 Chat history and conversation management

  -----------------------------------------------------------------------
  ID                                  Requirement
  ----------------------------------- -----------------------------------
  HIST-01                             Display the user's previous
                                      conversations.

  HIST-02                             Display conversation titles.

  HIST-03                             Open an existing conversation.

  HIST-04                             Continue an existing conversation.

  HIST-05                             Rename a conversation.

  HIST-06                             Delete a conversation.

  HIST-07                             Clearly distinguish General Chat
                                      and Document Chat.

  HIST-08                             Save messages and timestamps.

  HIST-09                             Deleting a document conversation
                                      also deletes its associated PDF and
                                      embeddings/chunks.
  -----------------------------------------------------------------------

**Deletion policy:** A PDF cannot be deleted independently while keeping
its conversation. Deleting a document conversation removes the
conversation, its PDF, and its associated vector/chunk data.

### 5.5 Dashboard and navigation

  ID      Requirement
  ------- -------------------------------------------------------
  UI-01   Show a dashboard after login.
  UI-02   Provide a separate **New General Chat** entry point.
  UI-03   Provide a separate **New Document Chat** entry point.
  UI-04   Display recent conversations.
  UI-05   Provide access to chat history.
  UI-06   Provide profile and logout options.

## 6. Non-functional requirements

  -----------------------------------------------------------------------
  ID                      Category                Requirement
  ----------------------- ----------------------- -----------------------
  NFR-01                  Security                Users cannot access
                                                  another user's chats,
                                                  files, or vectors.

  NFR-02                  Performance             The interface remains
                                                  responsive and shows
                                                  progress during longer
                                                  operations.

  NFR-03                  Reliability             AI provider, upload,
                                                  extraction, and
                                                  vector-search failures
                                                  are handled gracefully.

  NFR-04                  File validation         Document Chat accepts
                                                  PDF files only.

  NFR-05                  File size               Maximum PDF upload size
                                                  is 10 MB.

  NFR-06                  Privacy                 Uploaded documents and
                                                  conversation data are
                                                  protected.

  NFR-07                  Usability               Support common desktop
                                                  and mobile screen
                                                  sizes.

  NFR-08                  Error handling          Show clear messages for
                                                  invalid files,
                                                  processing failures,
                                                  and AI errors.

  NFR-09                  Answer grounding        Document-chat answers
                                                  are based on retrieved
                                                  context and disclose
                                                  when evidence is
                                                  insufficient.
  -----------------------------------------------------------------------

## 7. User flows

### 7.1 General AI chat

1.  User registers or signs in.
2.  User opens the dashboard and selects **New General Chat**.
3.  User sends a message.
4.  The backend loads relevant conversation history.
5.  The backend sends the message and history to the LLM.
6.  The response is displayed and the conversation is saved.
7.  The user can reopen and continue the conversation.

### 7.2 Document chat

1.  User registers or signs in.
2.  User selects **New Document Chat** and uploads one PDF (maximum 10
    MB).
3.  The backend validates the file and extracts text.
4.  Extracted text is chunked and embeddings are generated.
5.  Chunks, vectors, and document metadata are stored.
6.  The interface shows processing status until the document is ready.
7.  User asks a question.
8.  The backend embeds the question and retrieves relevant chunks.
9.  Retrieved context and the question are sent to the LLM.
10. The answer and source references are displayed and messages are
    saved.
11. User can reopen and continue the document conversation.

## 8. Acceptance criteria

### Authentication

-   [ ] Registration works with valid details.
-   [ ] Email/password sign-in works.
-   [ ] Google sign-in works.
-   [ ] Invalid credentials produce a safe error.
-   [ ] Unauthenticated users cannot access protected pages or APIs.
-   [ ] Users cannot access another user's data.

### General AI chat

-   [ ] A user can create a conversation and send a message.
-   [ ] An LLM response is displayed.
-   [ ] Follow-up questions use previous conversation context.
-   [ ] Messages persist and can be reopened.
-   [ ] Loading and error states are visible.

### Document chat

-   [ ] A valid PDF up to 10 MB is accepted.
-   [ ] Non-PDF and oversized files are rejected.
-   [ ] Text extraction and chunking work for supported PDFs.
-   [ ] Embeddings and metadata are stored.
-   [ ] Relevant chunks are retrieved for a question.
-   [ ] The LLM receives retrieved context.
-   [ ] Answers display source references that map to the PDF.
-   [ ] The assistant indicates when relevant information is not found.
-   [ ] Chat is disabled until processing succeeds.
-   [ ] Processing failures are visible and recoverable.

### History and dashboard

-   [ ] Recent conversations are listed and distinguishable by type.
-   [ ] A user can reopen and continue a conversation.
-   [ ] A user can rename and delete a conversation.
-   [ ] Deleting a document conversation also deletes its PDF and
    vectors.
-   [ ] The dashboard has separate New General Chat and New Document
    Chat actions.

## 9. Out of scope for V1

-   Voice conversations
-   Image generation
-   Web search
-   Multiple PDFs in one conversation
-   Word, Excel, and other document formats
-   OCR for scanned PDFs
-   AI agents and agent workflows
-   Flashcards and quizzes
-   Payments and subscriptions
-   Team collaboration
-   Native mobile applications
-   Background document processing and notifications

## 10. Assumptions and risks

1.  **Broad audience:** "Everyone" is an initial positioning choice, not
    proof of market demand. Validate it with real users.
2.  **AI costs:** Chat, embeddings, and document questions may incur
    provider costs. Add usage limits and monitor costs before public
    launch.
3.  **PDF variability:** Scanned, encrypted, malformed, and
    complex-layout PDFs may not work in V1.
4.  **Source accuracy:** References must map retrieved chunks to real
    PDF page numbers or reliable locations. Never fabricate citations.
5.  **Deletion reliability:** Define retry and error handling for
    partial deletion of files and vector data.
6.  **Authentication security:** Test OAuth verification, token/session
    handling, and ownership checks.

## 11. Proposed technology direction

  Layer              Proposed technology
  ------------------ ----------------------------------------
  Frontend           React + Tailwind CSS
  Backend            Node.js + Express
  Primary database   MongoDB
  Authentication     Email/password + Google OAuth
  File upload        Multer
  PDF extraction     A maintained PDF parsing library
  Generative AI      One LLM provider
  Embeddings         One embedding model
  Vector retrieval   MongoDB Atlas Vector Search (proposed)
  Version control    Git + GitHub

Exact libraries and models will be selected during technical design
after checking current APIs, pricing, limits, and compatibility.

## 12. High-level architecture

``` text
React Client
    |
    v
Express API
    |
    +---- Authentication
    |
    +---- General Chat ----------------> LLM Provider
    |
    +---- Document Upload
              |
              v
        PDF Text Extraction
              |
              v
           Chunking
              |
              v
          Embeddings
              |
              v
      Vector Storage / Search
              |
              v
      Retrieve Relevant Chunks
              |
              v
       LLM + Retrieved Context
              |
              v
          AI Response

MongoDB: users, conversations, messages, document metadata
File storage: uploaded PDF files
Vector storage: chunk embeddings and retrieval metadata
```

## 13. Delivery milestones

  Milestone   Deliverable
  ----------- -----------------------------------------------
  M1          PRD, MVP scope, and project documentation
  M2          Repository and backend project setup
  M3          Authentication and database foundation
  M4          General AI chat and conversation context APIs
  M5          Chat history and management APIs
  M6          PDF upload and text extraction
  M7          Chunking, embeddings, and vector search
  M8          RAG answers and source references
  M9          Backend testing and API contract freeze
  M10         Frontend implementation and API integration
  M11         Full testing, security review, and deployment

## 14. Definition of done

The MVP is ready when the acceptance criteria for authentication,
General AI Chat, Document Chat, history, and dashboard pass testing,
including user data isolation and document deletion behavior.
