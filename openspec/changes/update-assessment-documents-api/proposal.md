---
id: update-assessment-documents-api
title: Update Assessment Documents API
description: >
  Realign assessment-service document endpoints to match docs/specs-dashboard-documents.md: base path /api/v1/documents, stats/list filters CRUD favorites, per-user ownership, and expanded data model.
author: Codex
status: proposal
depends-on: []
---

## Proposal

docs-v1/assessment-service-documents-missing.md highlights multiple gaps versus docs/specs-dashboard-documents.md. The current assessment-service exposes `/api/v1/assessment/documents` with only title/url/type fields, no ownership, and missing stats, filtering, and favorites. This proposal brings the documents API in line with the documented behavior.

### Goals

- Move the documents API to `/api/v1/documents` and support stats, filtered list (category/isFavorite/q), CRUD, and favorite toggling per the dashboard documents spec.
- Expand the data model to store content, category enum, course, tags, favorite flag, timestamps, and enforce per-user ownership with authorization.
- Align request/response bodies and validation with the documented models (title/content/category required; tags/course optional).

### Non-Goals

- Server-side file storage or attachments; URLs/files remain out of scope for this change.
- Collaboration, versioning, or sharing/download flows beyond what the spec notes as client-side.
- Cross-user admin tooling or bulk document imports.

### Impact

- Specs: new capability `assessment-documents-api` capturing the required endpoints and ownership rules.
- Service: assessment-service migration plus domain/DTO/controller/service changes to deliver the spec on `/api/v1/documents` with filters, favorites, and stats.
- Gateway/Docs/Tests: route updates if needed, refreshed API docs, and unit/integration coverage for ownership, filters/search, and stats.
