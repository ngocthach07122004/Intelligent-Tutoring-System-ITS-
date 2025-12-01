## Context
The dashboard documents feature is defined in docs/specs-dashboard-documents.md but has no backend implementation. The change needs to provide per-user document storage with stats, filtering, CRUD, and favorite toggling exposed at /api/v1/documents.

## Goals / Non-Goals
- Goals: deliver the documented endpoints, enforce per-user ownership, store document metadata/content with favorites/tags, and surface stats for the current user.
- Non-Goals: attachments, collaborative editing, versioning, or server-side download/share flows; cross-user search or discovery.

## Decisions
- Service placement: implement the documents module inside user-profile-service to minimize new infrastructure and reuse existing auth/user context handling; if growth requires, it can later be split into a dedicated documents-service.
- Persistence model: add a documents table (id UUID, user_id UUID, title, content TEXT/markdown, category ENUM note|assignment|reference|project, course optional string, tags stored as TEXT[]/JSONB via converter, is_favorite BOOLEAN default false, created_at/updated_at timestamps). Content is stored as text; binary attachments are out of scope.
- Filtering/search: support query params category, isFavorite, and q; q performs case-insensitive search across title, content, and tags using SQL ILIKE/contains; default sort by updatedAt desc for dashboard recency. List responses may truncate content; detail returns full content.
- Auth/ownership: use JWT subject for user scoping; all operations are restricted to the authenticated user. Access to another user's document returns a non-leaking failure (404 preferred) instead of exposing existence.
- API behavior: POST returns 201 with generated id and timestamps; PUT and PATCH return 200 with updated document and refreshed updatedAt; DELETE returns 204; stats are scoped to the requester and include totals, per-category counts, and favorite count.

## Risks / Trade-offs
- Storing document content in the profile-service database may grow table size; monitor and consider a dedicated service/storage if usage expands.
- Simple ILIKE search may degrade with large data; may need indexes or full-text search later.
- Returning 404 for unauthorized access may complicate admin tooling; document and revisit if admin access is needed.

## Migration Plan
- Add the Flyway migration for the documents table.
- Deploy the updated user-profile-service and gateway route; no backfill is required because the feature is net-new.

## Open Questions
- Should we enforce a maximum content length or rely on DB/text column defaults?
- Do we need pagination parameters on list responses for the dashboard UI, or is the full list acceptable for the initial release?
- Should the optional course field be validated against course-service, or stored as-is?
