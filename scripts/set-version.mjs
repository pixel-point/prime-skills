import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const requestedVersion = process.argv
  .slice(2)
  .find((argument) => argument !== "--")
  ?.trim();
const releaseVersionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

if (!requestedVersion || !releaseVersionPattern.test(requestedVersion)) {
  console.error("Usage: pnpm release:prepare -- <semver>");
  console.error("Example: pnpm release:prepare -- 0.2.0");
  process.exit(1);
}

function cachebusterTimestamp(date = new Date()) {
  return date
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
}

async function readJson(relativePath) {
  const filePath = path.join(packageRoot, relativePath);
  return {
    filePath,
    value: JSON.parse(await readFile(filePath, "utf8")),
  };
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

const packageJson = await readJson("package.json");
const codexManifest = await readJson(".codex-plugin/plugin.json");
const claudeManifest = await readJson(".claude-plugin/plugin.json");
const pluginVersion = `${requestedVersion}+codex.${cachebusterTimestamp()}`;

packageJson.value.version = requestedVersion;
codexManifest.value.version = pluginVersion;
claudeManifest.value.version = pluginVersion;

await Promise.all([
  writeJson(packageJson.filePath, packageJson.value),
  writeJson(codexManifest.filePath, codexManifest.value),
  writeJson(claudeManifest.filePath, claudeManifest.value),
]);

console.log(`Prepared Prime Skills ${requestedVersion}.`);
console.log(`Plugin manifest version: ${pluginVersion}`);
console.log(`Release tag: v${requestedVersion}`);
console.log(`Monorepo tag: prime-skills-v${requestedVersion}`);
