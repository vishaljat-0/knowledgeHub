# Knowledge Hub — Product & UX Design

**Status:** Planning  
**Scope:** MVP  
**Related documents:** `PRD.md`, `MVP-SCOPE.md`, `ARCHITECTURE.md`, `API-CONTRACT.md`, `USER-FLOWS.md`

## 1. Design goals

Knowledge Hub helps an authenticated user:
1. Have a general AI conversation.
2. Upload one PDF into a document conversation.
3. Ask questions grounded in that PDF.
4. Inspect source-page references supporting an answer.
5. Reopen, rename, and delete conversation history.

The interface should make the document-processing state and the evidence behind an answer clear. Avoid presenting an answer as document-grounded when retrieval found no useful evidence.

## 2. Product principles

- **Clarity over decoration:** prioritize readable messages, clear actions, and visible status.
- **Evidence is visible:** document answers include source references with page numbers.
- **Progress is explicit:** show upload/processing/ready/failed states.
- **Safe by default:** users only see their own conversations and documents.
- **One focused MVP:** no collaboration, folders, multi-document workspaces, or advanced agent features in V1.

## 3. Information architecture

### Authenticated application

- **Dashboard / Home**
  - Start General Chat
  - Start Document Chat
  - Recent conversations
- **General Chat**
  - Conversation title
  - Message history
  - Message composer
  - Rename and delete actions
- **Document Chat**
  - PDF file information
  - Processing status
  - Message history and composer
  - Answer source references
  - Delete conversation/document action
- **Account actions**
  - Sign out

### Public pages

- Register
- Login
- Google sign-in entry point

## 4. Core screen requirements

### 4.1 Login and registration

Include:
- Email and password fields.
- Field-level validation messages.
- Submit/loading state.
- Clear authentication errors.
- Google sign-in option.
- Link between login and registration.

Do not reveal whether an arbitrary email address is registered through overly specific error messages.

### 4.2 Dashboard

Include:
- Clear actions to start a General Chat or Document Chat.
- Recent conversation list, grouped or sorted by most recently updated.
- Conversation type indicator.
- Empty state for a new account.
- Loading and error states.

### 4.3 General Chat

Include:
- User and assistant message distinction.
- Message composer with send action.
- Pending/loading state while the assistant responds.
- Error state with a retry path where safe.
- Conversation rename and delete controls.
- Reopening a conversation restores its messages.

### 4.4 Document Chat

Include:
- PDF-only upload control.
- Visible maximum file size: 10 MB.
- Filename and upload result.
- Processing states: `uploaded`, `processing`, `ready`, `failed`.
- Disable question submission until status is `ready`.
- Explain unsupported scanned/image-only PDFs in the MVP.
- Show answer sources as page references.
- Show an explicit no-evidence response when the document does not support an answer.
- Deleting the document conversation also removes its associated PDF, document metadata, chunks/vectors, and messages according to the deletion policy.

## 5. Shared UI states

Every data-driven screen must account for:

| State | Expected presentation |
|---|---|
| Loading | Progress indicator; prevent duplicate submissions |
| Empty | Explain what the user can do next |
| Success | Show the created/updated resource |
| Validation error | Explain what needs correction |
| Unauthorized | Ask the user to sign in again |
| Not found | Explain that the resource is unavailable |
| Server/provider error | Show a safe message; do not expose stack traces |
| Processing | Explain that the PDF is not ready for questions yet |
| Processing failed | Show failure state and a clear next action |

## 6. Responsive behavior

- Support desktop and mobile widths.
- Keep the primary chat composer reachable on small screens.
- Conversation navigation may collapse into a drawer on mobile.
- Source references must remain readable and tappable.
- Do not rely on hover-only actions.

## 7. Accessibility and interaction

- Use semantic headings, buttons, labels, and form controls.
- All controls must be keyboard accessible.
- Provide visible focus states.
- Associate validation messages with their fields.
- Do not communicate processing state using color alone.
- Use accessible names for icon-only actions.
- Preserve readable contrast and text sizing.

## 8. Content and AI response presentation

- Render assistant responses as readable text/Markdown with safe rendering.
- Render source references separately from answer prose.
- A source reference should include at least the page number and a stable source/chunk identifier where appropriate.
- Do not fabricate page numbers or citations on the client.
- Clearly distinguish general chat from document-grounded chat.

## 9. Out of scope for MVP

- Multiple PDFs in one document conversation.
- Scanned-PDF OCR.
- DOCX, PPTX, images, spreadsheets, or URL ingestion.
- Sharing, collaboration, comments, and public links.
- Folder/tag organization.
- Voice input/output.
- Billing/subscriptions.
- Autonomous multi-step agents.
- Admin analytics dashboard.

## 10. Design acceptance checklist

- [ ] A new user can understand the two chat modes.
- [ ] Upload restrictions are visible before upload.
- [ ] Processing and failure states are understandable.
- [ ] Questions cannot be submitted before a document is ready.
- [ ] Document answers show backend-provided source references.
- [ ] Empty, loading, validation, unauthorized, and server-error states exist.
- [ ] Core flows work on desktop and mobile.
- [ ] Keyboard focus and form labels are usable.
