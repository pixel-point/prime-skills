import { access, chmod, copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourcePath = path.resolve(
  packageRoot,
  "../primeui-visual-audit/dist/cli/main.cjs",
);
const targetPath = path.join(packageRoot, "runtime", "visual-audit", "cli.cjs");
const checkOnly = process.argv.includes("--check");

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(sourcePath))) {
  if (!checkOnly) {
    throw new Error(
      "Visual audit build is missing. Run `pnpm --filter @primeuicom/visual-audit build` first.",
    );
  }
  const target = await readFile(targetPath, "utf8");
  if (!target.includes("primeui visual audit error")) {
    throw new Error("Bundled visual audit runtime is invalid.");
  }
  console.log(
    "Visual audit runtime exists; source build is unavailable in this checkout.",
  );
  process.exit(0);
}

const source = await readFile(sourcePath);
if (checkOnly) {
  const target = await readFile(targetPath).catch(() => undefined);
  if (!target || !source.equals(target)) {
    throw new Error(
      "Bundled visual audit runtime is stale. Run `pnpm --filter @primeuicom/skills-marketplace sync:visual-audit`.",
    );
  }
  console.log("Visual audit runtime is byte-identical to the package build.");
  process.exit(0);
}

await mkdir(path.dirname(targetPath), { recursive: true });
await copyFile(sourcePath, targetPath);
await chmod(targetPath, 0o755);
console.log(`Synchronized visual audit runtime to ${targetPath}.`);
