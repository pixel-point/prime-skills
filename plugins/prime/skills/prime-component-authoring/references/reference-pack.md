# Prime Reference Pack

Use a reference pack only for a section classified as `adapt` or `custom`. The purpose is to ground local code in maintained Prime patterns without loading or copying the whole registry.

## Required Inputs

- Two or three closest Prime candidate component IDs.
- Candidate descriptions, family/group metadata, visual metadata, compact schema, and default props.
- Materialized source and dependency files retrieved through the component-export workflow when source inspection is needed.
- The target project's closest page sections, UI primitives, tokens, and utility patterns.
- The root and nearest nested repository instructions.

## Selection

Choose references that cover distinct implementation questions:

- one for semantic anatomy and content slots;
- one for the closest visual or layout treatment;
- optionally one for the required responsive or interactive behavior.

Do not select three nearly identical references merely because they have the highest candidate scores.

## Extraction Notes

Record only the decisions needed for implementation:

```text
semantic anatomy:
layout/container:
responsive behavior:
typography/tokens:
class composition:
interaction/accessibility:
assets/dependencies:
verification commands:
```

Do not paste whole source files into the report. Keep downloaded reference artifacts in the existing Prime temporary export location and cite their paths.

## Conflict Resolution

When references disagree:

1. explicit repository instructions win;
2. established target-project conventions win over unrelated registry conventions;
3. accessibility and correct interaction semantics win over literal visual imitation;
4. the Figma reference decides visual details that do not violate the higher-priority rules.

## Completion

The reference pack is sufficient when another agent can explain why the new component uses its chosen structure, tokens, responsive model, and dependencies without rediscovering the whole registry.
