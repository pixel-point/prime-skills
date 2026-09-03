# Prime Skills

![Prime](plugins/prime/assets/prime-logo.png)

Prime Skills is the source marketplace for agent workflows that connect Figma design context, Prime components, and local frontend implementation.

The repository is currently developed inside the Prime monorepo. The standalone `pixel-point/prime-skills` repository is a private publication target until the workflows and installation experience are ready for public use.

## What It Provides

- An installable `prime` plugin for Codex-compatible plugin marketplaces.
- Project-local access to the existing `@primeuicom/mcp` server.
- Prime page-building guidance without requiring manual component-catalog browsing.
- A local-first Figma-to-Prime workflow with `reuse`, `adapt`, and `custom` matching.
- Prime-conformant local component authoring when no suitable registry component exists.

The current private preview contains the marketplace foundation, the existing `primeui-page-builder` workflow, Figma orchestration guidance, design and match contracts, custom component authoring rules, and visual parity requirements. End-to-end validation against a controlled Figma frame is still required before public release.

## Requirements

- Node.js 22 or newer.
- `pnpm` 10.
- A project linked to Prime through `.primeui/project.json`.
- A compatible Figma design provider connected separately when using the Figma workflow.

Figma credentials are not stored in this marketplace or sent through Prime MCP.

## Install From The Prime Monorepo

From the Prime repository root:

```bash
codex plugin marketplace add ./packages/prime-skills
codex plugin add prime@prime-skills
```

Start a new task after installation so the plugin's skills and tools are discovered from a fresh context.

## Usage

For existing Prime page work:

```text
Use Prime to inspect my current project and build the /pricing page.
```

The Figma workflow supports requests such as:

```text
Build this Figma frame as /pricing in my current project using Prime.
```

The workflow reads Figma through the separately connected design provider. It does not write to Figma or create page state inside Prime Studio.

## Development

The Prime monorepo is the only authoring source. Do not edit the publication repository independently.

Validate the marketplace:

```bash
pnpm --filter @primeuicom/skills-marketplace validate
```

Synchronize Prime skills that are also bundled into exported-project agent presets:

```bash
pnpm --filter @primeuicom/agent-setup sync:prime-skills
```

Run the relevant package tests before proposing publication.

## Publication

From the Prime repository root, the publication helper validates and prepares the `packages/prime-skills` subtree. Its default mode performs no push:

```bash
pnpm prime-skills:publish
```

External publication requires the explicit `--push` flag and separate approval:

```bash
pnpm prime-skills:publish -- --push
```

Changing repository visibility, creating a release, or submitting the plugin to the universal directory are separate release decisions.

## Status

This marketplace is under active private development. Installation contracts and workflows may change before the first public release.

## License

No public license has been selected yet. Add one before making the repository public.
