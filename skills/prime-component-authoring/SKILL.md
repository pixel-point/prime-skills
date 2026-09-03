---
name: prime-component-authoring
description: Adapt or create a local React and Tailwind page component from Prime implementation references when an existing Prime component cannot be reused unchanged. Use for Figma-to-Prime sections classified as adapt or custom. Do not use for registry write-back or unrelated general component work.
---

# Prime Component Authoring

Create the smallest local component that matches the design while retaining Prime's engineering quality. Prime references are implementation patterns, not a requirement to preserve unsuitable markup.

## Preconditions

Use this workflow only after:

- the target repository and its nearest instructions have been inspected;
- the design section has been normalized and classified as `adapt` or `custom`;
- Prime candidate retrieval has identified the closest relevant component families;
- the target path and existing local consumers are understood.

If an existing Prime component fits without structural changes, return to the `reuse` path instead of creating another component.

## Build The Reference Pack

Read [reference pack](references/reference-pack.md) before collecting examples.

Keep the pack small: normally two or three Prime candidates plus the target project's closest local patterns. Use existing Prime candidate, validation, and component-export tools rather than calling private APIs or copying the whole registry.

The pack must establish:

- semantic anatomy and component boundaries;
- container, grid, flex, and responsive conventions;
- typography, spacing, color, radius, shadow, and motion tokens;
- prop and variant patterns;
- class composition conventions;
- asset handling and allowed dependencies;
- accessibility and client/server boundaries;
- repository verification commands.

If the references conflict, local repository instructions and existing target-project conventions win unless they prevent the requested design outcome.

## Choose Adapt Or Custom

Use `adapt` when the Prime component anatomy and behavior remain valid and the differences are limited to local layout, responsive rules, styling, or decoration. Derive a page-local component when changing a shared implementation could affect other routes.

Use `custom` when the section needs different semantic anatomy, content slots, interaction behavior, or responsive structure. Create a focused component rather than accumulating conditional branches in a poorly fitting Prime component.

Record the chosen Prime reference component IDs in the implementation report for both modes.

## Authoring Contract

- Preserve semantic HTML, keyboard behavior, focus visibility, labels, alternative text, reduced motion, and interaction state semantics.
- Follow the repository's Server Component default and introduce client boundaries only for actual browser APIs, effects, event handlers, or local interactive state.
- Use the project's existing `cn`, `cva`, token, and variant conventions. Keep Tailwind classes statically discoverable.
- Prefer semantic tokens and shared container utilities. Use an exact local value when the design requires it, but do not scatter repeated arbitrary values; promote repetition into a clearly named local token or constant.
- Model content and variants with typed props. Keep data separate from markup when nearby components do so.
- Preserve exact Figma assets when available. Do not silently substitute fonts, images, icons, or illustrations.
- Treat a composite Figma export as a source asset, not a component. Crop it to bounded media-only regions and author surrounding headings, copy, icons, cards, and controls as DOM.
- Never preserve a dead affordance for visual similarity. Every visible tab, arrow, selector, accordion trigger, or button must use the project's interaction primitives and expose keyboard, focus, and selected/expanded state.
- If only one interaction state exists in the source, reuse known content for the missing state or repeat known carousel items. Make the state change observable, label the fallback honestly, and record it instead of inventing product claims.
- Build responsive behavior from content and layout constraints rather than scaling the desktop frame mechanically.
- Split independent interactive islands and substantial visual sections instead of generating one monolithic page component.
- Reuse existing project dependencies. Add a dependency only when the required behavior cannot be expressed cleanly with the current stack.
- Keep the component local. Do not register, sync, or publish it back to Prime without a separate reviewed workflow and explicit user request.

## Visual Correction

Use the Figma reference and rendered browser state to correct the component. Prioritize structural geometry before decorative differences:

1. container and section dimensions;
2. grid, alignment, and wrapping;
3. typography and text measure;
4. spacing and responsive transitions;
5. color, border, radius, shadow, media, and motion.

If a visual correction would violate accessibility, product behavior, or repository policy, preserve the higher-priority requirement and report the difference.

## Verification

Run change-scoped repository checks and rendered verification for every affected viewport. For a shared component adaptation, check every known consumer. For a page-local component, check the target page plus surrounding layout and navigation.

Report the created or adapted files, Prime references, intentional deviations, synthesized interaction states, dependencies, check results, and visual evidence. Browser verification must click every visible affordance and confirm an observable state change. Do not describe the component as Prime-ready for registry publication; the MVP produces local project code only.
