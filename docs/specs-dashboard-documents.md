# Route: /dashboard/documents

## Overview

This document specifies the API endpoints for the document management feature (`/dashboard/documents`). This feature allows users to create, read, update, delete, and organize their personal documents, such as notes, assignments, and reference materials.

## API Usage

- **Current Status**: Backend not implemented. The API defined here is based on the frontend UI requirements.
- **Proposed Backend Service**: A new `documents-service` or integrated within `user-profile-service`.

---

### Data Models

#### `Document` Object

Defines the structure for a user's document.

| Field        | Type                                                | Description                                                  | Example                                    |
|--------------|-----------------------------------------------------|--------------------------------------------------------------|--------------------------------------------|
| `id`         | `string`                                            | Unique identifier for the document.                          | `"doc-12345"`                              |
| `title`      | `string`                                            | The title of the document.                                   | `"Ghi chú Lập trình Python - Buổi 1"`      |
| `content`    | `string`                                            | The full content of the document (can be Markdown).          | `"Các khái niệm cơ bản về biến..."`         |
| `category`   | `'note' \| 'assignment' \| 'reference' \| 'project'` | The category of the document.                                | `'note'`                                   |
| `course`     | `string` (optional)                                 | The course code this document is related to.                 | `"CS101"`                                  |
| `createdAt`  | `string` (ISO 8601 Date)                            | The timestamp when the document was created.                 | `"2024-09-01T10:00:00Z"`                   |
| `updatedAt`  | `string` (ISO 8601 Date)                            | The timestamp when the document was last updated.            | `"2024-09-15T14:30:00Z"`                   |
| `tags`       | `List<string>`                                      | A list of tags for organization.                             | `["python", "programming"]`                |
| `isFavorite` | `boolean`                                           | `true` if the document is marked as a favorite.              | `true`                                     |

#### `DocumentStatistics` Object

Defines the structure for the aggregate statistics shown on the dashboard.

| Field             | Type     | Description                                  | Example |
|-------------------|----------|----------------------------------------------|---------|
| `totalDocuments`  | `number` | The total number of documents.               | `25`    |
| `notesCount`      | `number` | The number of documents in 'note' category.  | `15`    |
| `assignmentsCount`| `number` | The number of documents in 'assignment' category. | `5`     |
| `favoritesCount`  | `number` | The number of documents marked as favorite.  | `8`     |

---

### Endpoints

#### 1. Get Document Statistics

- **Endpoint**: `GET /api/v1/documents/stats`
- **Description**: Retrieves aggregate statistics for the user's documents.
- **Response Body**: `DocumentStatistics`

---

#### 2. Get All Documents

- **Endpoint**: `GET /api/v1/documents`
- **Description**: Retrieves a list of all documents for the current user, with support for filtering and searching.
- **Query Parameters**:
  - `category` (optional): Filters by category. Accepts `'note'`, `'assignment'`, `'reference'`, `'project'`.
  - `isFavorite` (optional): If `true`, returns only favorite documents.
  - `q` (optional): A search query string to filter documents by `title`, `content`, or `tags`.
- **Response Body**: `List<Document>` (Note: `content` field may be truncated for brevity in the list view).

---

#### 3. Create a New Document

- **Endpoint**: `POST /api/v1/documents`
- **Description**: Creates a new document.
- **Request Body**: A subset of the `Document` object.
  - `title` (required, `string`)
  - `content` (required, `string`)
  - `category` (required, `'note' | 'assignment' | 'reference' | 'project'`)
  - `course` (optional, `string`)
  - `tags` (optional, `List<string>`)
- **Response Body**: The newly created `Document` object.

---

#### 4. Get a Single Document

- **Endpoint**: `GET /api/v1/documents/{id}`
- **Description**: Retrieves the full details of a single document.
- **Response Body**: The complete `Document` object.

---

#### 5. Update a Document

- **Endpoint**: `PUT /api/v1/documents/{id}`
- **Description**: Updates the details of an existing document.
- **Request Body**: The complete `Document` object with updated fields.
  - `title` (required, `string`)
  - `content` (required, `string`)
  - `category` (required, `'note' | 'assignment' | 'reference' | 'project'`)
  - `course` (optional, `string`)
  - `tags` (optional, `List<string>`)
- **Response Body**: The updated `Document` object.

---

#### 6. Toggle Favorite Status

- **Endpoint**: `PATCH /api/v1/documents/{id}/favorite`
- **Description**: Toggles the `isFavorite` status of a document.
- **Request Body**:
  - `isFavorite` (required, `boolean`)
- **Response Body**: The updated `Document` object.

---

#### 7. Delete a Document

- **Endpoint**: `DELETE /api/v1/documents/{id}`
- **Description**: Deletes a document.
- **Response**: `204 No Content` on success.

## Notes
- The frontend UI contains functionality for "Download" and "Share". These are considered client-side actions for now (e.g., generating a PDF from content or copying a link to the app) and do not require dedicated backend endpoints unless server-side rendering or sharing is implemented.
- The service responsible for these endpoints should handle user authentication and authorization, ensuring users can only access their own documents.