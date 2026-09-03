import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const marketplacePath = path.join(
  packageRoot,
  ".agents",
  "plugins",
  "marketplace.json",
);
const claudeMarketplacePath = path.join(
  packageRoot,
  ".claude-plugin",
  "marketplace.json",
);
const claudeManifestPath = path.join(
  packageRoot,
  ".claude-plugin",
  "plugin.json",
);
const expectedSkills = [
  "figma-to-prime",
  "prime-component-authoring",
  "primeui-page-builder",
];
const expectedEvalCases = [
  "adapt-component",
  "custom-component",
  "exact-component",
  "figma-instruction-injection",
  "local-file-conflict",
  "missing-figma-access",
  "missing-prime-link",
  "unrelated-figma-write",
];
const primeLogoSha256 =
  "7419807b8c62c99c6a91308559884afcd279bccadbfde2894b5a8e0fb9851530";

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function assertFile(filePath, label) {
  const fileStat = await stat(filePath);
  invariant(fileStat.isFile(), `${label} must be a file: ${filePath}`);
}

function resolveInsideRoot(relativePath, label) {
  invariant(
    relativePath.startsWith("./"),
    `${label} must start with ./: ${relativePath}`,
  );
  const resolvedPath = path.resolve(packageRoot, relativePath);
  invariant(
    resolvedPath === packageRoot ||
      resolvedPath.startsWith(`${packageRoot}${path.sep}`),
    `${label} escapes the marketplace root: ${relativePath}`,
  );
  return resolvedPath;
}

function readFrontmatterName(content, filePath) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  invariant(frontmatter, `Skill is missing YAML frontmatter: ${filePath}`);
  const name = frontmatter[1]
    .match(/^name:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]
    ?.trim();
  invariant(name, `Skill frontmatter is missing name: ${filePath}`);
  return name;
}

async function validateSkills(pluginRoot, manifest) {
  invariant(
    typeof manifest.skills === "string",
    `Plugin ${manifest.name} must declare a skills path`,
  );
  const skillsRoot = path.resolve(pluginRoot, manifest.skills);
  invariant(
    skillsRoot.startsWith(`${pluginRoot}${path.sep}`),
    `Skills path escapes plugin root: ${manifest.skills}`,
  );

  const entries = await readdir(skillsRoot, { withFileTypes: true });
  const skillDirectories = entries.filter((entry) => entry.isDirectory());
  invariant(
    skillDirectories.length > 0,
    `Plugin ${manifest.name} must contain at least one skill`,
  );

  const skillNames = skillDirectories.map((entry) => entry.name).sort();
  invariant(
    JSON.stringify(skillNames) === JSON.stringify(expectedSkills),
    `Plugin ${manifest.name} skills must be ${expectedSkills.join(", ")}; received ${skillNames.join(", ")}`,
  );

  for (const entry of skillDirectories) {
    const skillPath = path.join(skillsRoot, entry.name, "SKILL.md");
    await assertFile(skillPath, "Skill entrypoint");
    const skillName = readFrontmatterName(
      await readFile(skillPath, "utf8"),
      skillPath,
    );
    invariant(
      skillName === entry.name,
      `Skill name ${skillName} must match directory ${entry.name}`,
    );
  }
}

async function validateMcp(pluginRoot, manifest) {
  invariant(
    typeof manifest.mcpServers === "string",
    `Plugin ${manifest.name} must declare MCP configuration`,
  );
  const mcpPath = path.resolve(pluginRoot, manifest.mcpServers);
  invariant(
    mcpPath.startsWith(`${pluginRoot}${path.sep}`),
    `MCP path escapes plugin root: ${manifest.mcpServers}`,
  );
  const mcp = await readJson(mcpPath);
  const primeui = mcp.mcpServers?.primeui;

  invariant(primeui?.type === "stdio", "Prime MCP must use stdio transport");
  invariant(primeui.command === "npx", "Prime MCP must run through npx");
  invariant(
    Array.isArray(primeui.args) &&
      primeui.args.join("\0") === ["-y", "@primeuicom/mcp@latest"].join("\0"),
    "Prime MCP arguments must resolve @primeuicom/mcp@latest",
  );
  invariant(
    !("env" in primeui),
    "Prime MCP marketplace configuration must not embed credentials",
  );
}

async function validateBrandAssets(pluginRoot, manifest) {
  const expectedLogoPath = "./assets/prime-logo.png";
  invariant(
    manifest.interface?.composerIcon === expectedLogoPath,
    `Plugin ${manifest.name} must use the Prime Studio logo as composerIcon`,
  );
  invariant(
    manifest.interface?.logo === expectedLogoPath,
    `Plugin ${manifest.name} must use the Prime Studio logo`,
  );

  const logoPath = path.resolve(pluginRoot, expectedLogoPath);
  invariant(
    logoPath.startsWith(`${pluginRoot}${path.sep}`),
    "Prime logo path escapes plugin root",
  );
  await assertFile(logoPath, "Prime logo");
  const logoHash = createHash("sha256")
    .update(await readFile(logoPath))
    .digest("hex");
  invariant(
    logoHash === primeLogoSha256,
    "Plugin logo must stay byte-identical to the Prime Studio source asset",
  );
}

async function validatePlugin(entry) {
  invariant(
    typeof entry.name === "string" && entry.name.length > 0,
    "Marketplace plugin entry requires a name",
  );
  invariant(
    entry.source?.source === "local",
    `Plugin ${entry.name} must use a local marketplace source`,
  );
  invariant(
    entry.source?.path === "./",
    `Plugin ${entry.name} must use the release root as its source`,
  );
  invariant(
    entry.policy?.installation === "AVAILABLE",
    `Plugin ${entry.name} must be available for installation`,
  );
  invariant(
    entry.policy?.authentication === "ON_INSTALL",
    `Plugin ${entry.name} must authenticate on install`,
  );
  invariant(
    typeof entry.category === "string" && entry.category.length > 0,
    `Plugin ${entry.name} requires a category`,
  );

  const pluginRoot = resolveInsideRoot(
    entry.source.path,
    `Plugin ${entry.name} source path`,
  );
  const manifestPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");
  await assertFile(manifestPath, "Plugin manifest");
  const manifest = await readJson(manifestPath);

  invariant(
    manifest.name === entry.name,
    `Plugin manifest name must match marketplace entry ${entry.name}`,
  );
  invariant(
    /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(
      manifest.version,
    ),
    `Plugin ${entry.name} must use strict semver`,
  );
  invariant(
    typeof manifest.description === "string" && manifest.description.length > 0,
    `Plugin ${entry.name} requires a description`,
  );
  invariant(
    typeof manifest.author?.name === "string" &&
      manifest.author.name.length > 0,
    `Plugin ${entry.name} requires author.name`,
  );
  invariant(
    manifest.author?.email === "info@pixelpoint.io",
    `Plugin ${entry.name} must use the Pixel Point contact email`,
  );
  invariant(
    manifest.license === "MIT",
    `Plugin ${entry.name} must declare the MIT license`,
  );
  invariant(
    typeof manifest.interface?.displayName === "string",
    `Plugin ${entry.name} requires interface.displayName`,
  );
  invariant(
    typeof manifest.interface?.shortDescription === "string",
    `Plugin ${entry.name} requires interface.shortDescription`,
  );
  invariant(
    typeof manifest.interface?.longDescription === "string",
    `Plugin ${entry.name} requires interface.longDescription`,
  );
  invariant(
    typeof manifest.interface?.developerName === "string",
    `Plugin ${entry.name} requires interface.developerName`,
  );
  invariant(
    typeof manifest.interface?.category === "string",
    `Plugin ${entry.name} requires interface.category`,
  );
  invariant(
    Array.isArray(manifest.interface?.capabilities),
    `Plugin ${entry.name} requires interface.capabilities`,
  );
  invariant(
    Array.isArray(manifest.interface?.defaultPrompt),
    `Plugin ${entry.name} requires interface.defaultPrompt prompts`,
  );
  invariant(
    manifest.interface.defaultPrompt.length <= 3,
    `Plugin ${entry.name} supports at most three default prompts`,
  );
  invariant(
    manifest.interface.defaultPrompt.every(
      (prompt) => typeof prompt === "string" && prompt.length <= 128,
    ),
    `Plugin ${entry.name} default prompts must be strings of at most 128 characters`,
  );

  await validateSkills(pluginRoot, manifest);
  await validateMcp(pluginRoot, manifest);
  await validateBrandAssets(pluginRoot, manifest);

  return manifest;
}

async function validateClaudeCompatibility(codexManifest) {
  const claudeMarketplace = await readJson(claudeMarketplacePath);
  invariant(
    claudeMarketplace.name === marketplace.name,
    "Claude and Codex marketplaces must use the same name",
  );
  invariant(
    claudeMarketplace.owner?.name === "Pixel Point",
    "Claude marketplace owner must be Pixel Point",
  );
  invariant(
    Array.isArray(claudeMarketplace.plugins) &&
      claudeMarketplace.plugins.length === 1,
    "Claude marketplace must contain exactly one Prime plugin",
  );
  invariant(
    claudeMarketplace.plugins[0]?.name === codexManifest.name &&
      claudeMarketplace.plugins[0]?.source === "./",
    "Claude marketplace must point the Prime plugin at the release root",
  );

  const claudeManifest = await readJson(claudeManifestPath);
  for (const field of [
    "name",
    "version",
    "description",
    "homepage",
    "repository",
    "license",
  ]) {
    invariant(
      claudeManifest[field] === codexManifest[field],
      `Claude and Codex plugin manifests must share ${field}`,
    );
  }
  invariant(
    JSON.stringify(claudeManifest.author) ===
      JSON.stringify(codexManifest.author),
    "Claude and Codex plugin manifests must share author metadata",
  );
  invariant(
    claudeManifest.skills === "./skills/",
    "Claude plugin must load the canonical root skills directory",
  );
  await validateSkills(packageRoot, claudeManifest);
}

async function validateLicense() {
  const license = await readFile(path.join(packageRoot, "LICENSE"), "utf8");
  invariant(
    license.startsWith("MIT License\n"),
    "LICENSE must contain the MIT License",
  );
  invariant(
    license.includes("Copyright (c) 2026 Pixel Point"),
    "LICENSE must identify Pixel Point as the 2026 copyright holder",
  );
}

async function validateEvals() {
  const evalPath = path.join(packageRoot, "evals", "figma-to-prime.json");
  const evaluation = await readJson(evalPath);
  invariant(
    evaluation.version === 1,
    "Figma-to-Prime evaluation version must be 1",
  );
  invariant(
    Array.isArray(evaluation.cases),
    "Figma-to-Prime evaluation must contain cases",
  );

  const caseIds = evaluation.cases.map((entry) => entry.id).sort();
  invariant(
    JSON.stringify(caseIds) === JSON.stringify(expectedEvalCases),
    `Figma-to-Prime evaluation cases must be ${expectedEvalCases.join(", ")}`,
  );

  for (const entry of evaluation.cases) {
    invariant(
      typeof entry.prompt === "string" && entry.prompt.length > 0,
      `Evaluation ${entry.id} requires a prompt`,
    );
    invariant(
      Array.isArray(entry.expectedBehavior) &&
        entry.expectedBehavior.length > 0,
      `Evaluation ${entry.id} requires expected behavior`,
    );
  }
}

const marketplace = await readJson(marketplacePath);
invariant(
  marketplace.name === "prime-skills",
  "Marketplace name must be prime-skills",
);
invariant(
  marketplace.interface?.displayName === "Prime Skills",
  "Marketplace display name must be Prime Skills",
);
invariant(
  Array.isArray(marketplace.plugins) && marketplace.plugins.length > 0,
  "Marketplace must contain plugins",
);

invariant(
  marketplace.plugins.length === 1,
  "Marketplace must contain exactly one Prime plugin",
);
const codexManifest = await validatePlugin(marketplace.plugins[0]);

await validateClaudeCompatibility(codexManifest);
await validateLicense();
await validateEvals();

console.log(
  `Validated ${marketplace.plugins.length} plugin(s) in ${path.relative(process.cwd(), marketplacePath)}`,
);
