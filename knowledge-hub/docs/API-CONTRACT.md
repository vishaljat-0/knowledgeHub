# Knowledge Hub — API Contract

**Status:** Proposed MVP contract; finalize during backend implementation before frontend work.  
**Base path:** `/api`  
**Format:** JSON except PDF upload (`multipart/form-data`).  
**Authentication:** Protected routes use `Authorization: Bearer <access-token>` unless the final auth transport decision is recorded in `ARCHITECTURE.md`.

## 1. Contract conventions

### Success response

Use a consistent envelope:

```json
{
  "success": true,
  "data": {},
  "message": "Optional human-readable message"
}
```

### Error response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request could not be processed",
    "details": []
  }
}
```

Do not return stack traces, secrets, provider raw payloads, or private storage paths.

### Common status codes

| HTTP | Meaning |
|---|---|
| 200 | Successful read/update/action |
| 201 | Resource created |
| 202 | Accepted; asynchronous processing continues |
| 400 | Invalid request or upload |
| 401 | Missing/invalid authentication |
| 403 | Authenticated but not permitted |
| 404 | Resource not found or not owned |
| 409 | Conflict (for example, invalid state transition) |
| 413 | File/request too large |
| 415 | Unsupported media type |
| 429 | Rate/usage limit exceeded |
| 500 | Unexpected server error |
| 502/503 | Upstream AI provider unavailable or service temporarily unavailable |

Use a consistent not-found policy that does not reveal another user's resource existence.

## 2. Health

### `GET /health`

Public endpoint for basic API health.

**200**
```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

## 3. Authentication

### `POST /auth/register`

Create an account with email and password.

**Request**
```json
{
  "name": "Vishal",
  "email": "vishal@example.com",
  "password": "strong-password"
}
```

**201**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "Vishal",
      "email": "vishal@example.com"
    },
    "accessToken": "token"
  }
}
```

Do not return password hashes. Password policy and token transport/lifecycle must be finalized before implementation.

### `POST /auth/login`

**Request**
```json
{
  "email": "vishal@example.com",
  "password": "strong-password"
}
```

**200:** same user/token shape as registration.

### `POST /auth/google`

Verify a Google identity credential on the server. Never trust a client-supplied email as proof of identity.

**Request**
```json
{
  "credential": "google_identity_credential"
}
```

**200:** same user/token shape as login. Account-linking behavior must be defined safely during implementation.

### `GET /auth/me`

Protected. Return the authenticated user's safe profile.

**200**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "Vishal",
      "email": "vishal@example.com"
    }
  }
}
```

### `POST /auth/logout`

Protected. Client clears its local authentication state. If server-side token revocation is implemented, document its behavior and response here. A stateless JWT cannot be invalidated merely by deleting it in the browser.

**200**
```json
{
  "success": true,
  "data": null,
  "message": "Logged out"
}
```

## 4. Conversations and general chat

Conversation type is `general` or `document`.

### `POST /conversations`

Protected. Create a conversation.

**Request**
```json
{
  "type": "general",
  "title": "New chat"
}
```

For document chat, create the conversation through the PDF upload endpoint so document and conversation linkage cannot be left incomplete.

**201**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conversation_id",
      "type": "general",
      "title": "New chat",
      "createdAt": "ISO-8601",
      "updatedAt": "ISO-8601"
    }
  }
}
```

### `GET /conversations`

Protected. List only the authenticated user's conversations.

Optional query parameters:
- `type=general|document`
- `limit` (bounded server-side)
- `cursor` (pagination cursor; exact pagination strategy to be fixed in implementation)

**200**
```json
{
  "success": true,
  "data": {
    "conversations": [],
    "nextCursor": null
  }
}
```

### `GET /conversations/:conversationId`

Protected. Return one owned conversation and its messages. For a document conversation, include safe document metadata and processing status, not a public storage URL.

**200**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conversation_id",
      "type": "general",
      "title": "New chat",
      "createdAt": "ISO-8601",
      "updatedAt": "ISO-8601"
    },
    "messages": []
  }
}
```

### `PATCH /conversations/:conversationId`

Protected. Rename an owned conversation.

**Request**
```json
{
  "title": "Updated title"
}
```

**200:** returns updated conversation.

### `DELETE /conversations/:conversationId`

Protected. Delete an owned conversation. For document conversations, apply the full cleanup policy in `ARCHITECTURE.md`.

**200**
```json
{
  "success": true,
  "data": null,
  "message": "Conversation deleted"
}
```

If cleanup is incomplete, return a non-success response and retain enough state for retry/reconciliation; do not falsely report full deletion.

### `POST /conversations/:conversationId/messages`

Protected. Send a message in a general conversation.

**Request**
```json
{
  "content": "Explain closures in JavaScript"
}
```

**200**
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "message_id",
      "role": "user",
      "content": "Explain closures in JavaScript",
      "createdAt": "ISO-8601"
    },
    "assistantMessage": {
      "id": "message_id",
      "role": "assistant",
      "content": "A closure is ...",
      "sources": [],
      "createdAt": "ISO-8601"
    }
  }
}
```

The server validates ownership and conversation type, persists both messages, and uses bounded conversation history.

## 5. PDF upload and document chat

### `POST /documents`

Protected. Create a document conversation and upload one PDF.

**Content type:** `multipart/form-data`

Fields:
- `file`: required, exactly one PDF, maximum 10 MB.
- Optional `title`: conversation title, if supplied.

The backend must verify file content/type, not only the extension. Scanned/image-only PDFs are unsupported in V1.

**202** (processing accepted)
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conversation_id",
      "type": "document",
      "title": "example.pdf"
    },
    "document": {
      "id": "document_id",
      "filename": "example.pdf",
      "sizeBytes": 123456,
      "status": "processing"
    }
  }
}
```

Depending on whether ingestion is synchronous or asynchronous, a successfully processed document may be returned with `status: "ready"` and HTTP 201/200. Finalize this behavior before implementation.

### `GET /documents/:documentId`

Protected. Return metadata and processing state for an owned document.

**200**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "document_id",
      "conversationId": "conversation_id",
      "filename": "example.pdf",
      "status": "ready",
      "pageCount": 12,
      "createdAt": "ISO-8601"
    }
  }
}
```

### `POST /conversations/:conversationId/questions`

Protected. Ask a question about the PDF associated with this document conversation. The conversation must belong to the user and its document must be `ready`.

**Request**
```json
{
  "content": "What are the main conclusions?"
}
```

**200**
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "message_id",
      "role": "user",
      "content": "What are the main conclusions?"
    },
    "assistantMessage": {
      "id": "message_id",
      "role": "assistant",
      "content": "The document concludes ...",
      "sources": [
        {
          "page": 4,
          "chunkId": "chunk_id",
          "excerpt": "Relevant short excerpt"
        }
      ]
    }
  }
}
```

Sources must be derived from retrieved chunk metadata. If no relevant evidence is found, return an answer that clearly says the PDF does not provide enough information and return an empty sources array.

### Document status values

- `uploaded`
- `processing`
- `ready`
- `failed`

The frontend must not allow questions until `ready`.

## 6. Error codes

Recommended stable codes:

- `VALIDATION_ERROR`
- `AUTH_REQUIRED`
- `AUTH_INVALID`
- `ACCOUNT_CONFLICT`
- `RESOURCE_NOT_FOUND`
- `FORBIDDEN`
- `FILE_REQUIRED`
- `FILE_TOO_LARGE`
- `UNSUPPORTED_FILE_TYPE`
- `PDF_TEXT_NOT_AVAILABLE`
- `DOCUMENT_NOT_READY`
- `DOCUMENT_PROCESSING_FAILED`
- `LLM_PROVIDER_ERROR`
- `EMBEDDING_PROVIDER_ERROR`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

## 7. Authorization rules

- Every protected endpoint requires valid authentication.
- Every conversation query/update/delete must include owner scoping.
- Every document operation must verify `userId` ownership.
- Vector retrieval must filter by the current user's document/conversation scope.
- Never trust a user ID supplied by the client for ownership decisions.
- Return no private file storage path or provider credential.

## 8. Backend API test checklist

- [ ] Health returns 200.
- [ ] Registration validates input and creates a user.
- [ ] Duplicate registration is handled safely.
- [ ] Login succeeds/fails correctly.
- [ ] Google credential is verified server-side.
- [ ] `/auth/me` rejects missing/invalid tokens.
- [ ] General conversation create/list/open/rename/delete works.
- [ ] Sending a general message persists user and assistant messages.
- [ ] PDF upload accepts a valid PDF up to 10 MB.
- [ ] Oversized, missing, malformed, scanned/image-only, and non-PDF uploads are handled.
- [ ] Document status moves to `ready` or `failed`.
- [ ] Document question is rejected before `ready`.
- [ ] RAG retrieval is scoped to the correct PDF and owner.
- [ ] Source page references are correct.
- [ ] No-context question does not produce fabricated document claims.
- [ ] Deletion removes the PDF, metadata, messages, chunks, and vectors.
- [ ] User A cannot read/update/delete User B's resources.
- [ ] Provider failures and rate limits return safe errors.
