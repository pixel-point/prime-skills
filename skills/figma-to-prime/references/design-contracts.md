# Figma-to-Prime Design Contracts

Use these contracts when materializing a local Figma-to-Prime run. They are local workflow artifacts, not Prime API request schemas.

## DesignBrief

```ts
type DesignBrief = {
  mode: "page" | "section-only";
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
    renderViewport: {
      width: number;
      height: number;
    };
    canvas: {
      width: number;
      height: number;
    };
    insertionContext: {
      operation: "append" | "insert" | "replace";
      anchor: string | null;
      protectedFiles: string[];
    } | null;
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
  sectionIntent: {
    preferredGroups?: string[];
    requiredInteractions?: Array<
      "tabs" | "carousel" | "accordion" | "selector"
    >;
    layout?: {
      structure?: string;
      container?: "narrow" | "base" | "wide" | "full";
      alignment?: "left" | "center";
      orientation?: "media-left" | "media-right";
      visualStyle?: string;
    };
    grid?: {
      columns?: number;
      itemCount?: number;
      pattern?: "uniform" | "asymmetric";
    };
    mediaPlacement?: "background" | "top" | "left" | "right" | "inside-cards";
  };
  assets: Array<{
    nodeId: string;
    role: string;
    format: string | null;
    localPath: string | null;
    status: "available" | "missing" | "media-pending" | "approved-export";
    implementation: "semantic-dom" | "prime-placeholder" | "approved-asset";
    aspectRatio: string | null;
    cropOrFocalGuidance: string | null;
    recommendedDimensions: string | null;
    recommendedFormat: string | null;
    replacementType: "image" | "video" | "animation" | null;
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
    intentDiagnostics: Array<{
      componentId: string;
      status: "match" | "partial" | "mismatch";
      score: number;
      matched: string[];
      mismatched: string[];
      unknown: string[];
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

After the table, record missing assets, `media-pending` replacement contracts, unresolved interaction meaning, dependency conflicts, font substitutions, exceptional CSS, and intentional visual deviations. Missing icons, wrong grid topology or spans, incorrect placeholder geometry, unapproved raster substitutions, incorrect caption layout, and materially different text wrapping are not intentional deviations; they are blocking mismatches.

## Classification Rules

Choose based on anatomy and behavior, not a numeric score alone:

- `reuse`: the component supports the section's semantic structure, required content slots, and interactions without markup changes;
- `adapt`: the structure and behavior fit, while styling, layout, decoration, or responsive behavior needs local changes;
- `custom`: the structure, content model, or interaction contract differs enough that adaptation would create brittle branches or misleading semantics.

## Visual Audit

Use the separate `prime-visual-parity` skill after implementation. It creates exact Figma and browser measurement manifests, aligned screenshots, overlays, diffs, a machine-owned `audit.json`, and a derived `summary.md`.

The agent must not author a manual pass table. Only `audit.json.status` may establish `layout-parity` or `full-visual-parity`. A missing runtime audit is blocking.

Keep `media-pending` replacement contracts in `DesignBrief`, then express each approved raster exclusion as a node-scoped media mask under the visual-parity measurement contract. The mask excludes pixels only; slot geometry remains blocking when incorrect.

## Artifact Location

Write each run under `.primeui/temp/figma-to-prime/<run-id>/`. Include:

- `design-brief.json`;
- `match-plan.json`;
- `match-report.md`;
- `measurements/figma.json` and `measurements/browser.json`;
- reference, rendered, overlay, and diff screenshots;
- machine-owned `audit.json` and derived `summary.md`;
- independent `verification.md` for build, runtime, responsive, accessibility, and interaction evidence.

Do not store API keys, tokens, cookies, provider configuration, or full authenticated provider responses.
