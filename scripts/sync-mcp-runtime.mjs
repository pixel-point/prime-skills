import { access, chmod, copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const mcpRoot = path.resolve(packageRoot, "../primeui-mcp");
const checkOnly = process.argv.includes("--check");
const files = [
  {
    source: path.join(mcpRoot, "dist", "service.js"),
    target: path.join(packageRoot, "runtime", "mcp", "service.js"),
    executable: true,
  },
  {
    source: path.join(mcpRoot, "dist", "service.js.map"),
    target: path.join(packageRoot, "runtime", "mcp", "service.js.map"),
  },
  {
    source: path.join(mcpRoot, "dist", "ui", "component-picker.html"),
    target: path.join(
      packageRoot,
      "runtime",
      "mcp",
      "ui",
      "component-picker.html",
    ),
  },
  {
    source: path.join(mcpRoot, "package.json"),
    target: path.join(packageRoot, "runtime", "package.json"),
  },
];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const missingSources = [];
for (const file of files) {
  if (!(await exists(file.source))) missingSources.push(file.source);
}

if (missingSources.length > 0) {
  if (!checkOnly) {
    throw new Error(
      "Prime MCP build is missing. Run `pnpm --filter @primeuicom/mcp build` first.",
    );
  }
  for (const file of files) {
    if (!(await exists(file.target))) {
      throw new Error(`Bundled Prime MCP runtime is missing: ${file.target}`);
    }
  }
  console.log(
    "Prime MCP runtime exists; source build is unavailable in this checkout.",
  );
  process.exit(0);
}

if (checkOnly) {
  for (const file of files) {
    const source = await readFile(file.source);
    const target = await readFile(file.target).catch(() => undefined);
    if (!target || !source.equals(target)) {
      throw new Error(
        "Bundled Prime MCP runtime is stale. Run `pnpm --filter @primeuicom/skills-marketplace sync:mcp`.",
      );
    }
  }
  console.log("Prime MCP runtime is byte-identical to the package build.");
  process.exit(0);
}

for (const file of files) {
  await mkdir(path.dirname(file.target), { recursive: true });
  await copyFile(file.source, file.target);
  if (file.executable) await chmod(file.target, 0o755);
}
console.log("Synchronized Prime MCP runtime into the plugin bundle.");
