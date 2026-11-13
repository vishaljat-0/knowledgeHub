# Knowledge Hub — User Flows

**Status:** Planning  
**Related documents:** `PRD.md`, `MVP-SCOPE.md`, `DESIGN.md`, `API-CONTRACT.md`

## 1. First-time user registration

1. User opens Knowledge Hub.
2. User chooses Register.
3. User enters name, email, and password, or chooses Google sign-in.
4. Client validates required fields for usability.
5. Backend validates input and creates/authenticates the account.
6. On success, user is authenticated and sent to the dashboard.
7. On failure, a safe, actionable error is shown.

**Success condition:** User reaches the dashboard with an authenticated session/token.

## 2. Returning user login

1. User opens Login.
2. User enters email and password or chooses Google sign-in.
3. Backend verifies credentials / Google identity.
4. Backend returns the authenticated user and token/session according to the final auth decision.
5. Client stores authentication according to the selected secure token strategy.
6. User reaches the dashboard.

**Failure paths:** invalid credentials, missing fields, provider failure, rate limit, network failure.

## 3. Start and use General Chat

1. User selects **New General Chat**.
2. Client requests a new `general` conversation.
3. Backend creates the conversation for the authenticated user.
4. User enters a message and submits it.
5. Backend validates ownership and message content.
6. Backend saves the user message.
7. Backend loads bounded prior context and calls the LLM.
8. Backend saves the assistant response.
9. Client displays both messages.
10. User may continue with follow-up questions.

**Failure paths:** empty message, expired/invalid authentication, provider timeout/rate limit, server failure. Do not lose a successfully persisted user message if the provider fails; the backend should return a recoverable error/state and avoid duplicating the message on retry.

## 4. Reopen and manage conversation history

1. User opens the dashboard.
2. Client requests the authenticated user's conversation list.
3. User selects a conversation.
4. Client requests the conversation and messages.
5. User may rename the conversation.
6. User may delete the conversation after confirmation.

**Authorization rule:** Backend returns only conversations owned by the authenticated user.

## 5. Start Document Chat and upload a PDF

1. User selects **New Document Chat**.
2. User selects one PDF.
3. Client displays the filename and performs basic client-side checks.
4. Client sends the file as `multipart/form-data`.
5. Backend authenticates the user.
6. Backend enforces exactly one PDF and the 10 MB limit, verifies the file content/type, and rejects invalid uploads.
7. Backend creates document/conversation metadata and stores the PDF privately.
8. Backend extracts text page by page, preserving page numbers.
9. Backend chunks text, generates embeddings, and stores vectors with ownership and page metadata.
10. Backend changes document status to `ready`, or `failed` if processing cannot complete.
11. Client displays the current status.

**MVP limitations:** PDF only; maximum 10 MB; scanned/image-only PDFs are unsupported because OCR is out of scope. A PDF with no usable embedded text must fail clearly rather than silently creating an empty knowledge source.

## 6. Ask a question about the uploaded PDF

1. User opens a document conversation.
2. Client checks document status.
3. If status is not `ready`, client disables the composer and explains that processing is still in progress or failed.
4. User submits a question.
5. Backend verifies conversation ownership and document readiness.
6. Backend embeds the question.
7. Backend retrieves relevant chunks filtered to the same document and authenticated owner.
8. Backend evaluates whether useful evidence was found.
9. If evidence exists, backend sends the question and retrieved context to the LLM with instructions to stay grounded.
10. Backend creates source references from retrieved page/chunk metadata.
11. Backend saves user and assistant messages.
12. Client displays the answer and source-page references.

**No-evidence path:** If retrieval finds no useful context, the assistant says the PDF does not contain enough information to answer. It must not invent a document-based answer.

## 7. Delete a document conversation

1. User selects Delete on a document conversation.
2. Client asks for confirmation and explains that the associated PDF and document-chat data will be removed.
3. Client sends the delete request.
4. Backend verifies ownership.
5. Backend performs cleanup of the stored PDF, vector chunks/embeddings, document metadata, messages, and conversation.
6. Backend confirms success only when required cleanup is complete.
7. Client removes the conversation from history.

**Partial-failure path:** If cleanup fails in one storage system, backend records a retry/reconciliation state and returns a safe non-success response. Do not claim deletion is complete while private artifacts remain.

## 8. Logout

1. User chooses Sign out.
2. Client calls the logout endpoint if required by the chosen auth strategy.
3. Client clears local authentication state.
4. User is redirected to Login.
5. Protected routes and API requests require authentication again.

The exact JWT expiry/revocation behavior must be finalized in `ARCHITECTURE.md`.

## 9. Key alternate and error flows

| Situation | Expected behavior |
|---|---|
| User opens protected route while signed out | Redirect to Login |
| Token is invalid/expired | Clear invalid auth state and request sign-in |
| User requests another user's conversation | Return safe 404/403 according to the chosen not-found policy |
| File is larger than 10 MB | Reject with `FILE_TOO_LARGE` |
| File is not a valid PDF | Reject with `UNSUPPORTED_FILE_TYPE` |
| PDF is scanned/image-only | Mark failed with `PDF_TEXT_NOT_AVAILABLE` |
| PDF extraction/embedding fails | Mark document failed; avoid orphaned partial data |
| User asks before document is ready | Reject with `DOCUMENT_NOT_READY` |
| Retrieval finds no relevant evidence | Return no-context answer and no sources |
| LLM provider is unavailable | Return safe provider error; preserve recoverable message state |
| Deletion partially fails | Do not claim success; schedule/record cleanup retry |

## 10. MVP end-to-end acceptance journeys

- [ ] Register → dashboard → start general chat → ask follow-up → refresh → reopen conversation.
- [ ] Login with existing account → dashboard → rename general conversation.
- [ ] Upload valid text-based PDF (under 10 MB) → wait for `ready` → ask supported question → inspect page source.
- [ ] Ask question not answered by the PDF → receive no-evidence response.
- [ ] Attempt oversized/non-PDF/scanned PDF → receive clear error.
- [ ] Delete document conversation → verify file, metadata, messages, chunks, and vectors are removed.
- [ ] Sign in as a second user → verify first user's conversations/documents are inaccessible.
- [ ] Logout → verify protected endpoints reject subsequent unauthenticated requests.
