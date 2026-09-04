# Measurement Contract

Create these files before running the auditor:

```text
<run-dir>/
├── measurements/
│   ├── figma.json
│   └── browser.json
├── reference/
└── rendered/
```

Both measurement files use schema version `1`:

```json
{
  "schemaVersion": 1,
  "source": "figma",
  "renderViewport": { "width": 1920, "height": 1080 },
  "canvas": { "width": 1920, "height": 10428 },
  "nodes": [],
  "mediaMasks": []
}
```

Use `source: "figma"` for design measurements and `source: "browser"` for browser measurements. Browser `mediaMasks` is always an empty array; the Figma manifest owns approved masks.

## Audit nodes

Every node has:

```json
{
  "id": "home.hero.heading",
  "sectionId": "home.hero",
  "parentId": "home.hero",
  "kind": "text",
  "role": "heading",
  "order": 1,
  "text": "Chosen first. Chosen again.",
  "box": { "x": 224, "y": 160, "width": 560, "height": 184 },
  "style": {
    "fontFamily": "Figtree",
    "fontWeight": 500,
    "fontSize": 88,
    "lineHeight": 92,
    "letterSpacing": -1.2,
    "color": "#040406",
    "backgroundColor": null,
    "borderWidth": null,
    "borderRadius": null,
    "padding": null,
    "gap": null,
    "opacity": 1
  },
  "lineCount": 2
}
```

Valid kinds are `page`, `section`, `element`, `text`, `control`, `icon`, and `media`. IDs must be unique and appear in DOM order. Use null only when a style property does not apply; do not use null for an unavailable value that should have been measured.

## Figma capture

Use a read-only programmatic Figma provider operation. Measure the selected page and its audited descendants without screenshot inference. Convert coordinates to the supplied page frame's origin. Preserve exact text and node order.

Capture font family, weight, size, line height, letter spacing, fills, borders, corner radii, opacity, padding, and item spacing when available. If exact programmatic access is unavailable, stop with blocking.

## Browser capture

At the exact `renderViewport`:

1. wait for `document.fonts.ready`;
2. disable deterministic transitions, animations, and caret rendering for capture;
3. sample document dimensions and audit-node boxes twice after consecutive animation frames;
4. require stable dimensions;
5. read computed styles and DOM order from `[data-prime-audit-id]`;
6. calculate text line count from range client rects rather than guessing from element height.

Save PNGs under `reference/` and `rendered/` with identical relative names. A section reference such as `reference/hero.png` must correspond to `rendered/hero.png`. Capture the audited node bounds; do not capture a full-width wrapper when the Figma reference is an inner 1472px frame.

Never resize a PNG after capture. Dimension differences are audit evidence.
