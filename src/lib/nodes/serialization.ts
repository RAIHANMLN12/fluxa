import type { Workflow, WorkflowNode, WorkflowEdge } from "@/types/workflow";

export function serializeWorkflow(
  name: string,
  description: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): Workflow {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    nodes: nodes.map((n) => ({
      ...n,
      data: { ...n.data },
    })),
    edges: edges.map((e) => ({ ...e })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function deserializeWorkflow(data: Workflow): Workflow {
  return {
    ...data,
    nodes: data.nodes.map((n) => ({
      ...n,
      data: { ...n.data },
    })),
    edges: data.edges.map((e) => ({ ...e })),
  };
}
