## Context
`docs-v1/assessment-service-documents-missing.md` reports gaps between the dashboard documents spec and the assessment-service implementation: wrong base path (`/api/v1/assessment/documents`), missing stats/filters/favorites/update, minimal data model (title/url/type only), no per-user ownership, and no validation aligned to the documented payloads.

## Goals / Non-Goals
- Goals: deliver the `/api/v1/documents` endpoints with stats, filters, CRUD, favorites, per-user ownership, and the documented data model (title/content/category/course/tags/isFavorite/timestamps).
- Non-Goals: attachments or binary storage, collaboration/versioning, server-side share/download flows, or admin bulk actions.

## Decisions
- Service placement: keep the documents API within assessment-service but conform to the dashboard spec path `/api/v1/documents`; consider gateway routing to this service for that prefix.
- Identifier and ownership: use UUID document ids and a `userId` owner column; resolve user from JWT `sub` on every operation; return 404 for non-owned docs to avoid leaking existence.
- Data model: fields include title (<=255), content (text/markdown), category enum (`note|assignment|reference|project`), optional course (string), tags stored as JSON array, `isFavorite` boolean default false, `createdAt/updatedAt` timestamps; deprecated `url/type` are not part of the spec and can be removed or migrated to content if needed.
- Filtering/search: support query params `category`, `isFavorite`, and `q` (case-insensitive search across title/content/tags); default sort by `updatedAt` desc; consider optional `course` filter if the UI needs it.
- Stats: provide counts per category plus favorites for the current user.
- API behavior: POST returns 201 with generated id and timestamps; PUT/PATCH return 200 with updated payload; DELETE returns 204; list may truncate content in responses if needed for performance.

## Risks / Trade-offs
- Migrating from the existing `documents` schema (Long id, url/type) to UUID + new fields may require backfill or data loss decisions.
- Adding search filters over content/tags may need indexes to avoid slow queries at scale.
- Moving the base path could impact existing clients using `/api/v1/assessment/documents`; need to decide on redirects or deprecation.

## Migration Plan
- Create/alter the documents table to the new schema with necessary indexes.
- Update domain/DTO/service/controller to use the new model and base path.
- Update gateway routing and API docs; deprecate/remove the old path if no clients depend on it.

## Open Questions
- Should we keep backward compatibility for `/api/v1/assessment/documents` (redirect/alias) or remove it outright?
- Are there existing documents that need migrating from url/type to content/category/tags? If so, how should they map?
- Should we enforce pagination limits on `GET /api/v1/documents`, and what defaults should we use?
- Does the UI require additional filters (e.g., by course) beyond category/isFavorite/q?
- Should the documents feature live in assessment-service long-term, or move to user-profile-service for ownership alignment?
