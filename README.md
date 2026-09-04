# <img src="assets/prime-logo.png" alt="Prime logo" height="42" align="absbottom"> Prime Skills

Prime Skills is the source marketplace for agent workflows that connect Prime page templates, Figma design context, Prime components, and local frontend implementation.

The repository is developed inside the Prime monorepo and published to the public `pixel-point/prime-skills` repository.

## What It Provides

- An installable `prime` plugin for Codex-compatible plugin marketplaces.
- Project-local access to the existing `@primeuicom/mcp` server.
- Prime page-building guidance without requiring manual component-catalog browsing.
- Template-driven blog, legal, docs, pricing, contact, and landing page workflows that do not require Figma.
- A local-first Figma-to-Prime workflow with `reuse`, `adapt`, and `custom` matching.
- Deterministic section-intent matching for full-page and single-section Figma work.
- Replaceable Prime media placeholders for unapproved Figma raster assets.
- Prime-conformant local component authoring when no suitable registry component exists.

The current public preview contains the marketplace foundation, the `primeui-page-builder` workflow, template-driven standard page delivery, Figma orchestration guidance, design and match contracts, custom component authoring rules, and visual parity requirements. The design-driven contour has been exercised against a controlled Percents Figma frame through Prime candidate matching, prop validation, component delivery, local build, and desktop/mobile browser verification.

## Requirements

- Node.js 22 or newer.
- `pnpm` 10.
- A local empty directory or Next.js project. PrimeUI CLI can guide first-time account, organization, project, binding, and agent setup without opening Prime Studio.
- A compatible Figma design provider connected separately when using the Figma workflow.

Figma credentials are not stored in this marketplace or sent through Prime MCP.

## Install

The GitHub repository is public.

### Codex

```bash
codex plugin marketplace add https://github.com/pixel-point/prime-skills.git --ref main
codex plugin add prime@prime-skills
```

Start a new task after installation so Codex discovers the plugin's skills and tools from a fresh context.

### Claude Code

```bash
claude plugin marketplace add https://github.com/pixel-point/prime-skills.git
claude plugin install prime@prime-skills
```

Run `/reload-plugins` or start a new Claude Code session after installation.

### Agent Skills Installers

```bash
npx skills add pixel-point/prime-skills --all
```

The repository keeps the canonical skills directly under `skills/`, so compatible skill installers can discover them without interpreting either plugin manifest.

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

Standard Prime pages do not require Figma:

```text
Add a complete blog to my current project using the standard Prime template.
```

```text
Add the standard Terms and Privacy Policy pages using Prime.
```

The page-builder first reuses matching pages already present in the linked Prime project. It creates only missing pages through Prime MCP, waits for their Studio templates to become export-ready, exports the full page bundles, and copies only the requested pages into the local project. These created pages persist in the linked Prime project and may be visible in Prime Studio.

A blog is imported as one functional bundle rooted at `/blog`, including its index, post route, categories, pagination, RSS, content adapters, and dependencies. The default legal bundle contains `/terms` and `/privacy-policy`; its text remains draft content requiring appropriate legal review.

The Figma workflow supports requests such as:

```text
Build this Figma frame as /pricing in my current project using Prime.
```

It also supports a narrow section-only request in an existing site:

```text
Add only this Figma section between the existing feature and CTA sections on /product using Prime.
```

Section-only work preserves the existing route, shared Header and Footer, unrelated sections, and project structure. Candidate requests send deterministic layout, grid, media-placement, and interaction intent to Prime; candidates with blocking structural mismatches remain visible as diagnostics but cannot outrank compatible components.

Figma raster media is not downloaded by default. The workflow preserves its exact media-slot geometry with the project's Prime token-based placeholder and records the slot as `media-pending` for later replacement by an approved image, video, or animation. SVG assets and existing approved local media are used normally. A raster logo or brand mark may be exported when no vector source exists.

The workflow reads Figma through the separately connected design provider. It does not write to Figma or create page state inside Prime Studio.

When the target has no `.primeui/project.json`, the workflow uses the PrimeUI CLI setup router:

```bash
npx @primeuicom/cli setup --ai-preset codex
```

- In an empty directory, setup creates or reuses a Prime project and exports the complete Next.js starter into the current directory.
- In an existing Next.js project, setup adds only the Prime binding and project-local agent setup; it does not replace application files.
- In any other non-empty directory, setup stops before writing and asks the user to choose a safe target.

When no organization profile exists, interactive setup asks for email and organization name, sends the verification email, accepts the emailed command in a masked terminal prompt, and resumes automatically. A non-interactive local chat may pass `--email` and `--organization-name` to send the email, then asks the user to run the secret command locally before retrying. The plugin never asks for bootstrap secrets in chat and does not require Prime Studio or GitHub OAuth.

## Development

The Prime monorepo is the only authoring source. Do not edit the publication repository independently.

The release root intentionally follows the same cross-agent layout as the SiteOS plugin:

```text
.agents/plugins/marketplace.json
.claude-plugin/marketplace.json
.claude-plugin/plugin.json
.codex-plugin/plugin.json
.mcp.json
assets/
skills/
```

Codex and Claude Code load the same `skills/` files. There are no independently maintained host-specific copies in this marketplace.

Validate the marketplace:

```bash
pnpm --filter @primeuicom/skills-marketplace validate
```

Synchronize Prime skills that are also bundled into exported-project agent presets:

```bash
pnpm --filter @primeuicom/agent-setup sync:prime-skills
```

After changing the Codex plugin version or local cachebuster, synchronize the Claude manifest:

```bash
pnpm --filter @primeuicom/skills-marketplace sync:manifest-version
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

### Version and tag a release

Prepare one SemVer version across `package.json`, the Codex manifest, and the Claude manifest:

```bash
pnpm --filter @primeuicom/skills-marketplace release:prepare -- 0.2.0
```

The plugin manifests retain a Codex cachebuster as build metadata, while public releases use the stable base version. Commit the prepared files and publish the subtree before tagging.

Dry-run the subtree projection:

```bash
pnpm prime-skills:publish
```

After explicit publication approval, publish the standalone branch and both release tags:

```bash
pnpm prime-skills:publish -- --push --release
```

This creates `vX.Y.Z` in `pixel-point/prime-skills` and `prime-skills-vX.Y.Z` in the monorepo. The standalone tag validates the release version and marketplace, then creates the matching GitHub Release through GitHub Actions. Existing tags are rejected before publication.

## Status

This marketplace is under active public-preview development. Installation contracts and workflows may change between preview releases.

## License

Prime Skills is available under the [MIT License](LICENSE). Developed by Pixel Point.
