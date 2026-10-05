# Visual Component Selection

Use the Prime MCP component picker after structural candidate review, not instead of it.

## Open The Picker

Call `component_picker_open` when:

- two or more candidates remain credible after rejecting `intentMatch.status: "mismatch"`;
- the user asks to browse, compare, review, preview, or choose Prime components visually.

Pass the same planning context used by `component_candidates_get`. Pass `candidateIds` in the reviewed ranking order. Do not include rejected blocking mismatches merely to fill the picker. Pass `targetSlot` when replacing a known Prime slot.

For one exact compatible candidate, continue without the panel unless the user requested visual review.

## Handle The Selection

The panel shows recommendations plus the compatible catalog and returns the user's confirmed component ID to the current chat. Treat that message as component selection only.

After confirmation:

1. acknowledge the exact selected component and preset when present;
2. author and validate props through `component_props_validate`;
3. use the normal component export, download, and copy sequence;
4. preserve all conflict, local-edit, visual-parity, and verification gates.

Confirmation does not authorize file overwrites, Prime page mutation, publication, deployment, or unrelated page changes.

## Fallbacks

- If the host does not render MCP Apps, show the reviewed candidate IDs and structural evidence in chat and ask the user to choose there.
- If the live preview fails, the canonical component metadata and selection remain usable; do not infer that the component is unavailable.
- If the catalog read fails, keep existing recommendations and report the connection error instead of treating the catalog as empty.
- If no compatible candidate exists, use the custom-authoring path. A user may inspect nearby references, but the picker must not turn a structural mismatch into `reuse`.

The picker is read-only. Do not wait for or simulate MCP Events in this workflow.
