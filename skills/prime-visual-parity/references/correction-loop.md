# Correction Loop

One user request may run at most five visual audit passes. Each pass uses freshly captured browser measurements and PNGs.

## Pass sequence

1. Read the machine violations in `audit.json`.
2. Group them by priority and shared cause. A container-width error may explain many child x-position errors; fix the earliest common cause first.
3. Change only properties supported by the measured expected values.
4. Run repository checks appropriate to the changed files.
5. Re-render, re-capture, and run the next audit pass.

Do not tune unrelated values while correcting one category. Do not use transforms or negative margins merely to hide a wrong container model.

## Stopping rules

Stop with pass when `audit.json.status` is `pass`.

Stop with blocking when:

- pass five still has violations;
- the runtime emits `correction-loop-stalled` after two non-improving passes;
- fresh Figma or browser measurements cannot be produced;
- the requested correction would require an unavailable asset or a product decision.

The final response must list the remaining node IDs, properties, expected values, actual values, and deltas. Never continue unbounded guess-and-check work.
