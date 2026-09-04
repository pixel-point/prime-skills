# Figma Measurement Capture

Use the connected Figma provider's read-only programmatic API after loading its required skill. Screenshots establish visual evidence but are not a source for numeric measurements.

## Mapping

Create a stable audit mapping before local implementation:

```json
[
  {
    "auditId": "home.hero.heading",
    "sectionId": "home.hero",
    "figmaNodeId": "7645:6336",
    "kind": "text",
    "role": "heading"
  }
]
```

Map semantic sections, content containers, headings, body copy, controls, icons, cards, and media slots. Do not map every decorative vector when a parent visual capture can audit it reliably.

## Required values

For each mapped node, retrieve directly from Figma:

- absolute x/y/width/height relative to the selected page frame;
- parent mapping and sibling order;
- exact visible text;
- font family, weight, size, line height, letter spacing, and rendered line count;
- fills, opacity, borders, and independent corner radii;
- auto-layout padding and item spacing;
- the exact node screenshot when raster comparison applies.

The manifest uses the stable audit ID, not the raw Figma node ID, as `id`. Preserve the raw node mapping in `design-brief.json` for traceability.

Normalize design coordinates to the selected frame origin without scaling. Record the full frame under `canvas` and the actual browser capture viewport separately under `renderViewport`.

If a property is not applicable, use null. If it is applicable but unavailable from the provider, stop with blocking rather than writing null or estimating it.

Create media masks only after the Figma-to-Prime workflow classifies the exact media node as pending. Read `media-masks.md` before adding one.
