# Knowledge Hub --- MVP Scope

**Version:** 1.0\
**Status:** Finalized

## MVP objective

Build one application with two separate AI experiences: 1. General AI
chat using an LLM. 2. PDF-based chat using Retrieval-Augmented
Generation (RAG).

Users must sign in before using either experience.

## Included in V1

### Account and access

-   Email/password registration and login
-   Google OAuth login
-   Logout
-   Protected routes and backend ownership checks

### General AI Chat

-   Create a new chat
-   Send text messages
-   Receive LLM responses
-   Follow-up questions use conversation context
-   Save and reopen conversations

### Document Chat

-   One PDF per conversation
-   Maximum upload size: 10 MB
-   PDF text extraction
-   Text chunking
-   Embedding generation
-   Vector storage and similarity retrieval
-   LLM answers using retrieved context
-   Source references
-   Clear response when relevant document context is not found
-   User waits until processing finishes before chatting

### Conversation management

-   Recent chat list
-   Separate General and Document chat types
-   Open and continue conversations
-   Rename and delete conversations
-   Deleting a document conversation also deletes its PDF and associated
    embeddings/chunks

### Dashboard

-   New General Chat
-   New Document Chat
-   Recent conversations
-   Profile and logout

## Explicitly excluded from V1

-   Multiple PDFs per conversation
-   Word, Excel, or other file types
-   OCR for scanned PDFs
-   Web search
-   Voice chat
-   Image generation
-   AI agents
-   Flashcards and quizzes
-   Payments/subscriptions
-   Team collaboration
-   Native mobile app
-   Background document processing and notifications

## Constraints

-   PDF maximum size: 10 MB
-   Authentication required
-   One PDF per document conversation
-   User waits for processing completion
-   User data must be isolated
-   Document-chat answers must use retrieved context and must not
    fabricate source references

## MVP completion test

A user can sign in, complete a General AI conversation, upload a
supported PDF, wait for processing, ask questions answered from
retrieved PDF content with source references, and manage both
conversation types from chat history.
