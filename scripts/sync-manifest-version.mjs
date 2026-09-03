import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const codexManifestPath = path.join(
  packageRoot,
  ".codex-plugin",
  "plugin.json",
);
const claudeManifestPath = path.join(
  packageRoot,
  ".claude-plugin",
  "plugin.json",
);

const codexManifest = JSON.parse(await readFile(codexManifestPath, "utf8"));
const claudeManifest = JSON.parse(await readFile(claudeManifestPath, "utf8"));

if (claudeManifest.version === codexManifest.version) {
  console.log(`Claude manifest already uses ${codexManifest.version}.`);
  process.exit(0);
}

const previousVersion = claudeManifest.version;
claudeManifest.version = codexManifest.version;
await writeFile(
  claudeManifestPath,
  `${JSON.stringify(claudeManifest, null, 2)}\n`,
  "utf8",
);

console.log(
  `Synchronized Claude plugin version: ${previousVersion} -> ${codexManifest.version}`,
);
