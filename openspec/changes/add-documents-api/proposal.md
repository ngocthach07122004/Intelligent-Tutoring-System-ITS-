---
id: add-documents-api
title: Add Document Management API
description: >
  Implement the dashboard document management endpoints from docs/specs-dashboard-documents.md so users can manage personal documents with stats, CRUD, favorites, and filtering.
author: Codex
status: proposal
depends-on: []
---

## Proposal

The dashboard documents specification (docs/specs-dashboard-documents.md) defines a documents feature with statistics, filtering, CRUD, and favorite toggles, but the backend is not yet implemented. This change will add the required API under /api/v1/documents so users can store and organize personal notes, assignments, references, and projects.

### Goals

- Deliver the endpoints described in docs/specs-dashboard-documents.md for stats, list with filters/search, create/read/update/delete, and favorite toggling.
- Persist document metadata and content per user with ownership enforcement and validation of categories/tags.
- Expose the API through the existing API Gateway and align DTOs with the documented models.

### Non-Goals

- Implement server-side document download/share flows; the UI-only actions stay client-side.
- Add collaborative editing, attachments, or versioning beyond the single-document payloads in the spec.
- Build recommendation or cross-user discovery features for documents.

### Impact

- Specs: new capability `documents-api` describing the document management endpoints.
- Services: add a documents module to user-profile-service (controllers, service, repository, DTOs) plus Flyway migration for storage.
- Gateway: route /api/v1/documents/** to user-profile-service and ensure auth/ownership checks.
- Testing/docs: unit/integration coverage for the endpoints and updated API docs for the service.
