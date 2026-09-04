# Template-Driven Pages

Use this workflow when the user requests a standard Prime page or page bundle without supplying a Figma source.

## Page Mapping

Use the user's explicit route when supplied. Otherwise apply these defaults:

| Request        | Slug              | Title              | `pageType`   |
| -------------- | ----------------- | ------------------ | ------------ |
| Blog           | `/blog`           | Blog               | `blogIndex`  |
| Pricing        | `/pricing`        | Pricing            | `pricing`    |
| Contact        | `/contact-us`     | Contact Us         | `contact-us` |
| Documentation  | `/docs`           | Documentation      | `docs`       |
| Terms          | `/terms`          | Terms & Conditions | `legal`      |
| Privacy policy | `/privacy-policy` | Privacy Policy     | `legal`      |

Use `landing` for a no-design landing page only when the user explicitly requests a standard landing template. `blogPost` is a supported Prime page type, but a generic request to add a blog must use the complete `blogIndex` bundle described below.

## Prime Project Boundary

The workflow persists missing requested pages in the linked Prime project, so they may become visible in Prime Studio. A clear request to add a page authorizes creation of that missing page as a normal implementation step. Briefly state what will be created before the first create call; do not ask for a redundant confirmation when the request is already explicit.

The request does not authorize changes to unrelated pages, existing variants, project description, deployment, publication, or repository history.

## Inventory Before Creation

1. Inspect local routes first. If the complete requested route already exists locally, preserve it and report that no import was needed. If it is incomplete, continue but treat the later copy result as a conflict-aware integration.
2. Call `project_pages_list` with the resolved `projectRoot`.
3. Normalize slugs to one leading slash and no trailing slash, except `/`.
4. Reuse a Prime page whose normalized slug and `pageType` both match.
5. Stop for review when the requested slug exists under a different `pageType`.
6. Create only pages that are absent. Never create another page to recover from a pending, failed, or conflicted run.

## Create A Standard Page

For every missing page, call `project_page_create` with:

- the resolved `projectRoot`
- the selected `slug`, `title`, and `pageType`
- `contentMode: "ai"`
- a narrow prompt that asks for the standard Prime template for this page type and contains no unsupported business or legal claims

Do not use `contentMode: "empty"`; it intentionally creates an empty variant. Do not supply `componentIds` in `ai` mode.

For the standard non-landing page types, Studio bypasses creative outline generation and materializes the maintained page-type template and blocks. Creation can still be asynchronous. Inspect the returned status, then use `project_page_get` with bounded retries until the page reports `wireframeStatus: "ready"` and `isReadyToExport: true`, or stop on `wireframeStatus: "error"`. A retry must inspect the same page id, not create another page.

## Export And Copy

After all requested Prime pages are ready:

1. Call `create_export` for the linked project.
2. Inspect the returned export status. Use `list_exports` only when status clarification is needed.
3. Call `download_export` after the export is complete.
4. Call `copy_page` once for each requested `originPageSlug`.
5. Review copied files, identical files, conflicts, missing dependencies, and the local copy report before editing.

`copy_page` is the bundle boundary. Do not replace it with a sequence of `copy_registry_component` calls for a standard page.

If page creation succeeded but export or copy failed, report the persisted Prime page ids and slugs. A later retry must reuse those pages.

## Blog Bundle

Treat "add a blog" as one `/blog` page with `pageType: "blogIndex"`. Its page export owns the blog index, article route, category and pagination routes, RSS route, Markdown content adapter, metadata helpers, components, and dependencies.

Copy `/blog` once. Do not create or copy a separate `blogPost` page merely to obtain `/blog/[slug]`; the blog-index export produces that route as part of the functional bundle. Create a standalone `blogPost` page only when the user explicitly requests a distinct post page in Prime and the current export capability reports it as available.

After copying, verify at least the index, one post route, one category or pagination route, and `/blog/rss.xml` when sample content makes those routes available.

## Legal Bundle

Unless the user provides another list, "add legal pages" means both:

- `/terms` as `Terms & Conditions`
- `/privacy-policy` as `Privacy Policy`

Create or reuse each page independently, then copy each page by its own slug. Add cookie policy, acceptable-use, DPA, or jurisdiction-specific pages only when requested.

Prime can provide template structure and draft sample content. Do not claim that the result is legally sufficient. Do not invent company-specific jurisdictions, data collection, retention, subprocessors, user rights, addresses, or legal contacts. Preserve explicit user-supplied facts; otherwise label remaining copy as requiring legal review in the final report.

## Local Integration

- Preserve compatible local theme tokens, typography, layout, header, and footer conventions.
- Do not blindly overwrite shared files returned as conflicts. Use the copy report to merge only what the requested routes need.
- Reconcile header and footer navigation after page copy. Add missing links without removing unrelated local links.
- Keep content in the exported content source instead of duplicating it in route markup.
- Run project-appropriate typecheck and build checks.
- Render the new routes at representative desktop and mobile widths and exercise visible navigation, search, filters, pagination, table-of-contents links, and other interactive controls that the exported template exposes.

## Final Report

Report separately:

- Prime pages created, reused, still generating, or failed;
- exported and copied page bundles;
- local files added, adapted, left identical, or conflicted;
- navigation changes;
- legal draft/review boundaries;
- build and browser verification actually completed.
