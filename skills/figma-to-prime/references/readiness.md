# Figma-to-Prime Readiness And Local Integration

## Provider readiness

1. Parse the supplied Figma URL and retain file and node identity.
2. Load the connected provider's required design-to-code guidance.
3. Confirm the provider can return structured context, a screenshot, and exact programmatic measurements for the selected node.

Screenshot-only access is insufficient for deterministic visual parity.

## Prime readiness

Check for `.primeui/project.json` at the target root.

- When present, run Prime MCP health with the absolute project root.
- When absent, classify the target before implementation and run `npx @primeuicom/cli setup --ai-preset <agent>`.
- An empty directory receives a complete Prime Next.js export in place.
- An existing Next.js project receives only its Prime binding and project-local baseline agent setup.
- Any other non-empty directory stops without writes.

Pass an explicit project slug, organization, or project root only when folder-derived resolution is ambiguous. Do not silently reuse an existing remote Prime project when the local folder is unlinked; setup must require an explicit reuse decision.

Interactive first-time setup may collect email and organization name, send verification, accept the emailed command through a masked terminal prompt, and resume. In non-interactive chat, collect only non-secret identity fields and ask the user to run the secret command locally. Never put bootstrap secrets in chat or artifacts.

## Request and route contract

Inspect root and nested repository instructions, Git status, the current implementation, and nearby patterns. Determine whether the request is a full page or `section-only`, then identify the target URL, route group, page key, insertion or replacement anchor, shared Header/Footer, typography module, token source, styling system, asset hierarchy, and required viewport.

Ask one focused question only when route, placement, product meaning, or required interaction cannot be inferred safely.

## Local assembly

- Preserve unrelated local work and use safe Prime copy operations.
- In `section-only` mode, protect the route, shared shell, unrelated sections, and project structure. Add or replace only the focused section and its minimal route integration.
- Preserve the existing route group. Map `/` to page key `home`; do not derive route groups, page folders, or asset roots from a brand, organization, project, or Figma frame name unless the user explicitly requests an isolated microsite.
- Let route files own metadata, direct section imports, route data, and visible section order. Do not introduce a page-named wrapper that only composes the route.
- Keep substantial sections in `src/components/pages/<page-key>/**`. Preserve Server Components and isolate client state to the smallest interactive section.
- Keep Header, Footer, providers, and other shell elements shared. Update reusable data, props, tokens, or variants instead of duplicating them in the page.
- Resolve Figma fonts against existing `next/font` infrastructure. Prefer the exact free Google Font; otherwise use the closest free Google Font and report the substitution.
- Use Tailwind utilities and semantic tokens by default. Update existing token sources for repeated values. Do not create page-local CSS modules; put unavoidable reusable keyframes, masks, or multi-selector rules in the existing styles hierarchy.
- Follow the existing public asset convention. For `/`, prefer `public/images/home/**`.
- Do not install dependencies until local and Prime delivery evidence shows they are necessary.
