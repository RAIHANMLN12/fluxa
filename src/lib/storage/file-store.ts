import fs from "fs";
import path from "path";
import type { Workflow } from "@/types/workflow";
import { ensureDirectories, getWorkflowsDir } from "./paths";

export function saveWorkflow(workflow: Workflow): void {
  ensureDirectories();
  const filePath = path.join(getWorkflowsDir(), `${workflow.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2), "utf8");
}

export function loadWorkflow(id: string): Workflow | null {
  const filePath = path.join(getWorkflowsDir(), `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export function listWorkflows(): { id: string; name: string; updatedAt: string }[] {
  ensureDirectories();
  const dir = getWorkflowsDir();
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const wf = JSON.parse(raw);
    return { id: wf.id, name: wf.name, updatedAt: wf.updatedAt };
  });
}

export function deleteWorkflow(id: string): boolean {
  const filePath = path.join(getWorkflowsDir(), `${id}.json`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

export function workflowExists(id: string): boolean {
  return fs.existsSync(path.join(getWorkflowsDir(), `${id}.json`));
}
