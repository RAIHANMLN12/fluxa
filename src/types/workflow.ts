import { type Node, type Edge } from "@xyflow/react";

export type NodeExecutionState = "idle" | "running" | "completed" | "error";

export interface GraphValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ExecutionNode {
  id: string;
  nodeType: string;
  order: number;
}

export interface WorkflowNodeData {
  nodeType: string;
  label: string;
  fields: Record<string, unknown>;
  output: { type: "text" | "image" | "video" | null; value: string | null };
  color: string;
  icon: string;
  [key: string]: unknown;
}

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}
