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
    pageKey: string;
    title: string;
    routeFile: string;
    routeGroup: string | null;
    sharedShell: {
      header: string | null;
      footer: string | null;
      layout: string | null;
    };
    referenceViewport: {
      width: number;
      height: number;
    };
  };
  tokens: {
    colors: Record<string, string>;
    typography: Record<
      string,
      {
        sourceFamily: string;
        sourceWeight: string | number | null;
        sourceStyle: string | null;
        selectedFamily: string;
        provider:
          | "next-font-google"
          | "next-font-local"
          | "existing"
          | "fallback";
        isExact: boolean;
        fallbackReason: string | null;
      }
    >;
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
  structuralContract: {
    anatomy: string[];
    grid: {
      columns: number | null;
      itemCount: number | null;
      spans: string[];
    };
    mediaPlacement: string | null;
    captionLayout: string | null;
    controls: Array<{
      label: string;
      icon: string | null;
      state: string | null;
    }>;
    textHierarchy: string[];
    candidateGroups: string[];
  };
  assets: Array<{
    nodeId: string;
    role: string;
    format: string | null;
    localPath: string | null;
    status: "available" | "missing" | "needs-export";
    implementation: "semantic-dom" | "bounded-media";
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
    rejectedCandidates: Array<{
      componentId: string;
      blockingDifferences: string[];
    }>;
    rationale: string[];
    props: Record<string, unknown>;
    targetPath: string;
  }>;
};
```

Use `componentId` for the selected Prime component on `reuse` and `adapt`. It may be `null` for `custom`, but `referenceComponentIds` must still identify the Prime examples grounding the implementation. Record the credible alternatives that were inspected in `rejectedCandidates`; do not list components that were never compared.

## Match Report

`match-report.md` should contain one row per section:

| Section | Role | Mode | Prime references | Target file | Result |
| ------- | ---- | ---- | ---------------- | ----------- | ------ |

After the table, record missing assets, unresolved interaction meaning, dependency conflicts, font substitutions, exceptional CSS, and intentional visual deviations. Missing icons, wrong grid topology or spans, different media treatment, incorrect caption layout, and materially different text wrapping are not intentional deviations; they are blocking mismatches.

## Classification Rules

Choose based on anatomy and behavior, not a numeric score alone:

- `reuse`: the component supports the section's semantic structure, required content slots, and interactions without markup changes;
- `adapt`: the structure and behavior fit, while styling, layout, decoration, or responsive behavior needs local changes;
- `custom`: the structure, content model, or interaction contract differs enough that adaptation would create brittle branches or misleading semantics.

## VisualComparison

`visual-comparison.md` must contain one exact-viewport result for every semantic section:

| Section | Reference crop | Rendered crop | Structure | Typography | Controls/icons | Media | Spacing | Result |
| ------- | -------------- | ------------- | --------- | ---------- | -------------- | ----- | ------- | ------ |

Use `pass`, `blocking`, or `externally-blocked` for Result. A successful build or interaction test cannot change a `blocking` result to `pass`. Record each correction pass and keep the final unresolved blocking list explicit.

## Artifact Location

Write each run under `.primeui/temp/figma-to-prime/<run-id>/`. Include:

- `design-brief.json`;
- `match-plan.json`;
- `match-report.md`;
- reference and rendered screenshots when available;
- `visual-comparison.md`;
- `verification.md`.

Do not store API keys, tokens, cookies, provider configuration, or full authenticated provider responses.
