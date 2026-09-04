---
name: prime-visual-parity
description: Audit and iteratively correct a Prime Figma implementation using exact design and browser measurements, aligned screenshots, media masks, and a machine-owned pass or blocking result. Use after Figma-to-code implementation or when a visual-parity claim needs deterministic proof. Do not use for general browser smoke tests or designs without exact measurement access.
---

# Prime Visual Parity

Prove visual fidelity with deterministic artifacts. The bundled runtime owns pass or blocking status; never infer success from a build, a clean console, a responsive screenshot, or a subjective image review.

## Preconditions

1. Confirm the target route runs locally and the requested Figma node is accessible.
2. Identify the exact Figma design canvas and the browser render viewport. A long design frame's height is canvas height, not browser viewport height.
3. Add stable `data-prime-audit-id`, `data-prime-audit-section`, `data-prime-audit-kind`, and `data-prime-audit-role` values to every audited section, text block, control, icon, card, and media slot. Use the same IDs in both measurement manifests.
4. Create `.primeui/temp/figma-to-prime/<run-id>/` and read [the measurement contract](references/measurement-contract.md).

Stop with `blocking` when exact Figma measurements or browser-page evaluation are unavailable. Do not replace them with screenshot estimates or prose.

## Capture

- Retrieve Figma values programmatically through the connected Figma provider. Read [Figma capture](references/figma-capture.md) before creating the design manifest.
- Use the repository-required browser workflow at the exact render viewport. Read [browser capture](references/browser-capture.md) and use its canonical page-evaluation contract.
- Save exact PNG captures with matching relative names under `reference/` and `rendered/`. Never scale one image to make its dimensions match the other.
- Read [media masks](references/media-masks.md) before excluding any pixels.

## Run The Audit

Read [thresholds](references/thresholds.md), then run:

```bash
node <skill-directory>/scripts/run-audit.mjs \
  --run-dir .primeui/temp/figma-to-prime/<run-id> \
  --pass <1-5>
```

Exit code `0` means machine `pass`. Exit code `2` means a valid machine `blocking` result. Exit code `1` means the audit could not run and must also block any parity claim.

Treat `.primeui/temp/figma-to-prime/<run-id>/audit.json` as authoritative. `summary.md` is derived output. Never hand-edit either file or replace its status in another report.

## Correct And Repeat

Read [the correction loop](references/correction-loop.md). Correct violations in this order:

1. viewport, page canvas, section order, and section boundaries;
2. typography, text width, line count, and wrapping;
3. grid tracks, positions, padding, and gaps;
4. controls, icons, borders, radii, colors, and opacity;
5. unmasked decorative raster differences.

Re-capture both browser measurements and rendered PNGs after every correction pass. Do not reuse stale browser artifacts.

Stop when the audit passes, after pass five, or after `correction-loop-stalled`. The latter two outcomes remain blocking and must report exact violations instead of continuing random edits.

## Claims

- `layout-parity` requires zero machine violations outside permitted raster content.
- `full-visual-parity` additionally requires no `media-pending` masks and a passing raster audit.
- `pixel-perfect` is allowed only as a user-facing shorthand for a passing full visual audit at the stated viewport. It is never a synonym for build success.
- Responsive widths without supplied Figma references are ordinary responsive acceptance, not pixel-perfect evidence.

Report the run directory, pass count, machine status, score, remaining violations, masked media, overlay and diff paths, browser viewport, and independent build/interaction results.
