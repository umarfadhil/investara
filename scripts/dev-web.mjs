import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = resolve(import.meta.dirname, "..");
const webDir = resolve(rootDir, "apps", "web");
const nextLockPath = resolve(webDir, ".next", "dev", "lock");
const candidatePorts = [3000, 3001, 3002, 3003, 3004, 3005];

async function fetchWithTimeout(url, timeoutMs = 600) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function findExistingServer() {
  if (!existsSync(nextLockPath)) {
    return null;
  }

  for (const port of candidatePorts) {
    const url = `http://localhost:${port}`;
    if (await fetchWithTimeout(url)) {
      return url;
    }
  }

  return null;
}

function startNextDev() {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const child = spawn(npmCommand, ["--workspace", "apps/web", "run", "dev"], {
    cwd: rootDir,
    stdio: "inherit",
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

const existingServerUrl = await findExistingServer();

if (existingServerUrl) {
  console.log(`Next dev server is already running at ${existingServerUrl}`);
  console.log("Use that URL, or stop the existing server before starting a new one.");
} else {
  startNextDev();
}
