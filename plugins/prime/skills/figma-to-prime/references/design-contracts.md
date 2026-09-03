# Figma-to-Prime Design Contracts

Use these contracts when materializing a local Figma-to-Prime run. They are local workflow artifacts, not Prime API request schemas.

## DesignBrief

```ts
type DesignBrief = {
  source: {
    url: string;
    fileKey: string;
    nodeId: string;
    frameName: string;
  };
  page: {
    slug: string;
    title: string;
    referenceViewport: {
      width: number;
      height: number;
    };
  };
  tokens: {
    colors: Record<string, string>;
    typography: Record<string, unknown>;
    spacing: Record<string, number>;
    radii: Record<string, number>;
  };
  sections: DesignSection[];
};

type DesignSection = {
  id: string;
  order: number;
  role: string;
  content: Record<string, unknown>;
  layout: Record<string, unknown>;
  visualTraits: Record<string, unknown>;
  responsiveIntent: Record<string, unknown>;
  interactions: string[];
  assets: Array<{
    nodeId: string;
    role: string;
    format: string | null;
    localPath: string | null;
    status: "available" | "missing" | "needs-export";
  }>;
};
```

Preserve the source values needed to trace a design decision. Omit raw provider payloads and any authentication data.

## MatchPlan

```ts
type MatchPlan = {
  pageSlug: string;
  sections: Array<{
    designSectionId: string;
    mode: "reuse" | "adapt" | "custom";
    componentId: string | null;
    referenceComponentIds: string[];
    rationale: string[];
    props: Record<string, unknown>;
    targetPath: string;
  }>;
};
```

Use `componentId` for the selected Prime component on `reuse` and `adapt`. It may be `null` for `custom`, but `referenceComponentIds` must still identify the Prime examples grounding the implementation.

## Match Report

`match-report.md` should contain one row per section:

| Section | Role | Mode | Prime references | Target file | Result |
| ------- | ---- | ---- | ---------------- | ----------- | ------ |

After the table, record missing assets, unresolved interaction meaning, dependency conflicts, and intentional visual deviations.

## Classification Rules

Choose based on anatomy and behavior, not a numeric score alone:

- `reuse`: the component supports the section's semantic structure, required content slots, and interactions without markup changes;
- `adapt`: the structure and behavior fit, while styling, layout, decoration, or responsive behavior needs local changes;
- `custom`: the structure, content model, or interaction contract differs enough that adaptation would create brittle branches or misleading semantics.

## Artifact Location

Write each run under `.primeui/temp/figma-to-prime/<run-id>/`. Include:

- `design-brief.json`;
- `match-plan.json`;
- `match-report.md`;
- reference and rendered screenshots when available;
- `visual-comparison.md`;
- `verification.md`.

Do not store API keys, tokens, cookies, provider configuration, or full authenticated provider responses.
