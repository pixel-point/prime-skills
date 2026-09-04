#!/usr/bin/env node

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const runtimePath = fileURLToPath(
  new URL("../../../runtime/visual-audit/cli.cjs", import.meta.url),
);
const child = spawn(process.execPath, [runtimePath, ...process.argv.slice(2)], {
  stdio: "inherit",
});

child.once("error", (error) => {
  process.stderr.write(
    `prime visual parity launcher error: ${error.message}\n`,
  );
  process.exitCode = 1;
});
child.once("exit", (code, signal) => {
  if (signal) {
    process.stderr.write(`prime visual parity runtime stopped by ${signal}\n`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
