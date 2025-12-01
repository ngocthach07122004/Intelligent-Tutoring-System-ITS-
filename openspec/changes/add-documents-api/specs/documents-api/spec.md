---
capability: documents-api
---

## ADDED Requirements

### Requirement: Document statistics endpoint
The system MUST provide aggregated document statistics for the authenticated user via `GET /api/v1/documents/stats`.
#### Scenario: Retrieve document statistics for current user
- **WHEN** an authenticated user calls `GET /api/v1/documents/stats`
- **THEN** the service returns `200 OK` with totals for all documents, counts by category (`note`, `assignment`, `reference`, `project`), and favorite count scoped to that user.

### Requirement: List documents with filters and search
The system MUST return the authenticated user's documents from `GET /api/v1/documents` and support category, favorite, and text query filters.
#### Scenario: Filter documents by category, favorite flag, and query
- **WHEN** a user requests `GET /api/v1/documents?category=note&isFavorite=true&q=python`
- **THEN** the response is `200 OK` containing only that user's documents matching the category, favorite status, or text search across title, content, and tags.
- **AND** list responses MAY truncate `content` while including id, title, category, course, tags, isFavorite, createdAt, and updatedAt.

### Requirement: Create document
The system MUST allow users to create a document via `POST /api/v1/documents` with required `title`, `content`, and `category` (`note`, `assignment`, `reference`, `project`) plus optional `course` and `tags`.
#### Scenario: Create a new document
- **WHEN** a user posts a valid payload to `/api/v1/documents`
- **THEN** the service returns `201 Created` with the persisted document including generated `id`, `isFavorite=false` by default, and `createdAt`/`updatedAt` timestamps.

### Requirement: Get document details
The system MUST return full details for a document owned by the authenticated user via `GET /api/v1/documents/{id}` and prevent access to others.
#### Scenario: Retrieve own document
- **WHEN** a user calls `GET /api/v1/documents/{id}` for a document they own
- **THEN** the service returns `200 OK` with the complete document including full `content`.
#### Scenario: Block access to another user's document
- **WHEN** a user calls `GET /api/v1/documents/{id}` for a document they do not own
- **THEN** the service returns an authorization failure (for example `404 Not Found` to avoid leaking existence).

### Requirement: Update document
The system MUST allow updating a document via `PUT /api/v1/documents/{id}` with a complete document payload and refresh its metadata.
#### Scenario: Update an existing document
- **WHEN** a user sends `PUT /api/v1/documents/{id}` with updated `title`, `content`, `category`, `course`, or `tags` for their document
- **THEN** the service returns `200 OK` with the updated document reflecting the new values and a refreshed `updatedAt`.

### Requirement: Toggle favorite status
The system MUST let users toggle the favorite flag via `PATCH /api/v1/documents/{id}/favorite` with an `isFavorite` boolean.
#### Scenario: Mark or unmark a document as favorite
- **WHEN** a user sends a `PATCH` request with `isFavorite=true` or `false`
- **THEN** the service returns `200 OK` with the document showing the updated `isFavorite` value and `updatedAt`.

### Requirement: Delete document
The system MUST allow users to delete their documents via `DELETE /api/v1/documents/{id}`.
#### Scenario: Delete a document
- **WHEN** a user sends `DELETE /api/v1/documents/{id}` for their document
- **THEN** the service returns `204 No Content`
- **AND** subsequent fetches for that document return an authorization failure because it no longer exists for that user.
