import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const WORKFLOWS_DIR = path.join(DATA_DIR, "workflows");
const OUTPUTS_DIR = path.join(DATA_DIR, "outputs");
const CONFIG_PATH = path.join(DATA_DIR, "config.json");

export function ensureDirectories(): void {
  for (const dir of [DATA_DIR, WORKFLOWS_DIR, OUTPUTS_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

export function getWorkflowsDir(): string {
  ensureDirectories();
  return WORKFLOWS_DIR;
}

export function getOutputsDir(): string {
  ensureDirectories();
  return OUTPUTS_DIR;
}

export function getConfigPath(): string {
  ensureDirectories();
  return CONFIG_PATH;
}
