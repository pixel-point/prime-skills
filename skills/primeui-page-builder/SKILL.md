---
name: primeui-page-builder
description: Build or edit pages in a Prime-linked local frontend project, including standard blog, legal, docs, pricing, and contact pages without Figma. Routes standard pages through Prime project creation and full-page export, and composed pages through component candidate retrieval, validation, delivery, local editing, and verification.
---

# PrimeUI Page Builder

Use this skill when the user asks to build or edit a local page in an exported PrimeUI project.

## PrimeUI Responsibilities

PrimeUI supplies candidate scoring, registry metadata, component delivery, props validation, and automatic external-planning diagnostics. The coding agent owns task interpretation, exported-project inspection, local file edits, ordered block state, and local verification.

## Readiness

1. Confirm `.primeui/project.json` exists at the exported project root. If it is missing, run `npx @primeuicom/cli setup --ai-preset <agent>` only after classifying the target as an empty directory or an existing Next.js project. The setup command exports a complete starter into an empty directory and performs a non-overwriting connection for an existing Next.js project. In an interactive local task with no organization profile, allow guided setup to collect or accept email and organization name, complete the emailed command through its masked prompt, and resume without Prime Studio or GitHub OAuth. In a non-interactive local chat, pass only the non-secret email and organization name so setup can send the email, ask the user to run the secret emailed command in their terminal, and then rerun setup. Never copy bootstrap secrets into chat or artifacts. Stop on any other non-empty target.
2. If the MCP client starts outside the exported project, pass explicit `projectRoot` to PrimeUI MCP tools.
3. Verify PrimeUI MCP health before planning with `npx @primeuicom/mcp@latest --health /absolute/project/path`.
4. For local or staging Studio, set `PRIMEUI_API_BASE_URL` to the intended Studio URL before health checks or MCP calls. For production, use the linked project config unless the environment intentionally overrides it.
5. Stop before planning or editing if readiness still fails after safe setup. Ask the user to complete the CLI-guided email step, rerun PrimeUI AI setup, pass the correct `projectRoot`, or fix the API base/key.

## Task Intake

Before planning, identify:

- target slug and stable `pageSlug`
- page theme or `pageType` intent
- product/business context and source copy
- acceptance expectations and local verification expectations

Reuse the same `pageSlug` for candidate retrieval, props validation, and diagnostics.

## Select The Source Mode

Classify the request before planning or calling page tools:

- `design-driven`: the user supplies a Figma file or node. Use the installed `figma-to-prime` workflow. When this skill is invoked from that workflow, use the candidate and delivery sections below for each normalized design section.
- `template-driven`: the user supplies no Figma source and requests a standard Prime page type or bundle. Read and follow [template-driven pages](references/template-driven-pages.md).
- `composition-driven`: no supplied design or complete standard template fits. Plan and assemble the page from Prime component candidates using the sections below.

Do not call a Figma provider for a template-driven or composition-driven request.

## Inspect The Exported Project

Before editing, inspect:

- route and page-file layout
- naming and slug conventions
- component import paths
- styling and design-token conventions
- existing PrimeUI component usage and local wrapper patterns
- package scripts for typecheck, build, dev, render, or browser checks

## Plan A Composed Page

Create a short local plan:

- chosen `pageType`
- intended sections and first-pass content outline
- expected local route/page file
- initial ordered `blocks[]`

For composition-driven pages and design-driven sections, start with an empty ordered `blocks[]` and append-first operations. Use `insert` only when placing a section before an already planned block, and `replace` only when revising a chosen block. Do not decompose a template-driven blog or documentation bundle into independent component-copy operations.

## Candidate Retrieval

Use MCP `component_candidates_get`; do not call the PrimeUI API directly.

For each section, provide:

- `pageSlug`
- `pageType`
- `blocks`: current ordered blocks as `{ "componentId": "..." }`
- `operation`: omit for append or pass explicit append/insert/replace
- optional `count`
- optional narrow `constraints`: `spreadDegree`, `allowedGroups`, `excludedGroups`, `excludeComponentIds`
- optional `projectRoot` when needed

Choose candidates using scores, group/family/layout rhythm, descriptions, visual metadata, default props, schemas, local context, page stage, and `copyHints`.

## Props Authoring And Validation

Author props from user context, local copy/content conventions, candidate metadata, `defaultProps`, `compactSchema`, and `jsonSchema`.

Use MCP `component_props_validate`; do not call the PrimeUI API directly. Validate with:

- `pageSlug`
- `componentId`
- stable caller-provided `blockId` for this planned local component instance
- `props`
- optional `projectRoot` when the MCP workflow needs an explicit exported-project root

Treat `valid: false` as normal structured feedback, not as a tool failure. It returns no `propsValidationId`; do not proceed to component export until props are corrected. Use `errors[].path`, `errors[].message`, `hints`, and schemas to revise props and retry validation.

When validation returns `valid: true`, keep `normalizedProps` as validated registry content props for the PrimeUI export handoff only. Use the returned `propsValidationId` and `block` identity (`blockId`, `componentId`, `contentKey`) to export a materialized component instance. Do not blindly spread `normalizedProps` into exported React components; slot-like props may be transformed by PrimeUI export materialization.

Keep `renderCheck` as a diagnostic only. Do not claim browser rendering is proven unless the response says a render check was attempted and passed.

## Component Delivery

Deliver or refresh the chosen component instance before editing the page. Follow `copyHints.deliveryToolchain`:

1. `create_component_export`
2. `download_component_export`
3. `copy_registry_component`

When validation was performed, pass `propsValidationId` to `create_component_export`. If no validation was performed intentionally, omit `propsValidationId`; this is the default-props export path and still returns a complete insertable component instance.

After `copy_registry_component`, use its `selectedBlock` for traceability and its `insertion` payload as the local page source of truth:

- `insertion.imports`
- `insertion.propsCode`
- `insertion.jsx`
- `insertion.referenceFiles`

You may refactor where the returned props live to match local project conventions, but preserve the materialized props/JSX semantics from the downloaded virtual export.

## Local Edit Loop

1. Edit local page files only after the component is available locally and props are valid or the intentional default-props export path was used.
2. Add the component instance using `copy_registry_component.insertion.imports`, `insertion.propsCode`, and `insertion.jsx`.
3. Update local ordered `blocks[]` with the chosen `componentId`.
4. Repeat candidate retrieval, optional delivery, prop authoring, validation, local edit, and block-state update until the page is complete.

## Local Verification And Evidence

Run project-appropriate local checks, such as typecheck, build, dev-server smoke, route rendering, or browser checks.

Before browser acceptance, inventory visible tabs, carousel arrows, selectors, accordions, and buttons. Exercise each one and verify an observable content, position, or accessible-state change. A visually accurate but dead control is a failed implementation.

Keep content and controls as semantic DOM even when the design source contains a flattened composite image. A composite image may be cropped into media-only regions, but it must not replace section copy, card structure, or visible controls. If alternate interaction content is absent, reuse known content or repeat known carousel items, preserve truthful labels and accessible state, and record the synthesized fallback.

Preserve evidence:

- selected candidates and why they were chosen
- validation outcomes
- touched local files
- verification commands/results
- tested affordances and observed state changes
- synthesized states caused by incomplete source designs
- external-planning log paths

## Diagnostics And Non-Mutation

Prime automatically logs candidate and validation requests/results by stable `pageSlug`. Inspect those logs when troubleshooting, but do not emit separate diagnostics events.

Candidate retrieval, props validation, delivery preparation, and local file edits do not mutate Prime page state. Template-driven creation is the only workflow in this skill that may create missing requested pages in the linked Prime project; follow its inventory and idempotency rules and do not mutate unrelated pages or variants.

Do not call sync-back or page-confirmation tools unless a future explicit sync-back workflow ships and the user requests it. In the final report, distinguish pages created or reused in Prime from files created, copied, adapted, or left conflicted in the local project.
