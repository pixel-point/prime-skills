# Figma Design Normalization

Retrieve the selected node's exact structure, text, variables, component relationships, vector assets, interactions, dimensions, style values, and screenshot. Do not implement directly from a raw provider response.

## Semantic recovery

- Infer section boundaries from headings, background changes, container resets, spacing, purpose, and interaction ownership. Split incorrectly grouped or flattened frames before matching.
- Keep headings, copy, labels, buttons, tabs, accordions, tables, cards, and navigation as semantic DOM.
- Treat screenshots and flattened groups as evidence, not implementation boundaries.
- Do not expand a section-only node into a page rewrite.

## Raster and vector boundary

- Do not download ordinary Figma raster media by default.
- Represent photographs, raster illustrations, device mockups, dashboards, charts, receipts, maps, textures, and similar regions with the project's token-based Prime placeholder while preserving exact geometry.
- Keep placeholders replaceable by image, video, or local animation without changing section anatomy.
- Record Figma node, role, aspect ratio, focal or crop guidance, recommended dimensions and format, and `media-pending` status.
- Decorative placeholders are `aria-hidden`; do not invent alternative text.
- Preserve exact SVG icons, vector illustrations, and vector logos. A raster logo may be exported only when no vector source exists. Other raster exports require explicit user approval.
- Never replace dense product media with an approximate hand-built visual unless the user requests functional reconstruction.

## Interaction recovery

- Inventory every visible button, tab, selector, arrow, accordion trigger, and carousel control.
- Record label, icon, placement, dimensions, selected state, and behavior. A text-only substitute does not match a control that visibly includes an icon.
- When alternate content is absent, implement the interaction contract and reuse available content. Repeat carousel content only when necessary to make controls observable.
- Preserve keyboard, focus, pointer, and accessible state behavior.
- Do not invent unsupported business claims for synthetic states.

## Exact measurements

Create exact programmatic measurement evidence for page canvas, sections, audited elements, typography, spacing, borders, radii, and media slots. Use stable IDs that can map to `data-prime-audit-id` in the local DOM.

Do not infer numeric measurements from a downscaled full-page screenshot. Do not treat full design canvas height as browser viewport height. The final measurement manifests are defined by `prime-visual-parity`.
