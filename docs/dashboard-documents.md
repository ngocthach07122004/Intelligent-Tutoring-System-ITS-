# Dashboard Documents API Coverage

## Route
- `/dashboard/documents`

## Component
- `src/app/dashboard/documents/page.tsx` -> `src/components/widgets/documents/DocumentManagement.tsx`

## API Calls
### List Documents
- **Endpoint:** `GET /api/v1/documents`
- **Function:** `assessmentServiceApi.listDocuments`
- **Status:** Covered.

### Get Document Stats
- **Endpoint:** `GET /api/v1/documents/stats`
- **Function:** `assessmentServiceApi.getDocumentStats`
- **Status:** Covered.

### Create Document
- **Endpoint:** `POST /api/v1/documents`
- **Function:** `assessmentServiceApi.createDocument`
- **Status:** Covered.

### Toggle Favorite
- **Endpoint:** `PATCH /api/v1/documents/{id}/favorite`
- **Function:** `assessmentServiceApi.toggleFavorite`
- **Status:** Covered.

### Delete Document
- **Endpoint:** `DELETE /api/v1/documents/{id}`
- **Function:** `assessmentServiceApi.deleteDocument`
- **Status:** Covered.

## Assessment
The documents route appears to have comprehensive API coverage for CRUD operations and statistics.
