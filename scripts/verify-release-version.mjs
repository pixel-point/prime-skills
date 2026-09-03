import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const tag =
  process.argv
    .slice(2)
    .find((argument) => argument !== "--")
    ?.trim() || process.env.GITHUB_REF_NAME?.trim();

if (!tag) {
  console.error("Usage: pnpm release:check -- v<semver>");
  process.exit(1);
}

async function readJson(relativePath) {
  return JSON.parse(
    await readFile(path.join(packageRoot, relativePath), "utf8"),
  );
}

const [packageJson, codexManifest, claudeManifest] = await Promise.all([
  readJson("package.json"),
  readJson(".codex-plugin/plugin.json"),
  readJson(".claude-plugin/plugin.json"),
]);
const expectedTag = `v${packageJson.version}`;
const codexBaseVersion = String(codexManifest.version).split("+")[0];

if (tag !== expectedTag) {
  throw new Error(
    `Release tag ${tag} must match package version ${expectedTag}.`,
  );
}
if (codexBaseVersion !== packageJson.version) {
  throw new Error(
    `Codex manifest base version ${codexBaseVersion} must match package version ${packageJson.version}.`,
  );
}
if (claudeManifest.version !== codexManifest.version) {
  throw new Error(
    "Codex and Claude plugin manifest versions must match exactly.",
  );
}

console.log(`Release version verified: ${tag}`);
