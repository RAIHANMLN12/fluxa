import type { WorkflowNode, WorkflowEdge, WorkflowNodeData } from "@/types/workflow";
import type { GraphValidationResult, ExecutionNode } from "@/types/workflow";

export function validateGraph(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): GraphValidationResult {
  const errors: string[] = [];

  if (nodes.length === 0) {
    return { valid: false, errors: ["No nodes in workflow"] };
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const adj = new Map<string, string[]>();
  const inDeg = new Map<string, number>();

  for (const n of nodes) {
    adj.set(n.id, []);
    inDeg.set(n.id, 0);
  }

  for (const e of edges) {
    if (!nodeMap.has(e.source)) {
      errors.push("Edge references unknown source node: " + e.source);
      continue;
    }
    if (!nodeMap.has(e.target)) {
      errors.push("Edge references unknown target node: " + e.target);
      continue;
    }
    adj.get(e.source)?.push(e.target);
    inDeg.set(e.target, (inDeg.get(e.target) ?? 0) + 1);
  }

  const connectedNodes = new Set<string>();
  for (const e of edges) {
    connectedNodes.add(e.source);
    connectedNodes.add(e.target);
  }
  const orphans = nodes.filter((n) => !connectedNodes.has(n.id));
  for (const n of orphans) {
    errors.push('Orphan node: "' + n.data.label + '" (' + n.id + ") - no connections");
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();
  let hasCycle = false;

  function dfs(u: string) {
    visited.add(u);
    recStack.add(u);
    for (const v of adj.get(u) ?? []) {
      if (!visited.has(v)) dfs(v);
      else if (recStack.has(v)) hasCycle = true;
    }
    recStack.delete(u);
  }

  for (const n of nodes) {
    if (!visited.has(n.id)) dfs(n.id);
  }

  if (hasCycle) {
    errors.push("Workflow contains a cycle");
  }

  return { valid: errors.length === 0, errors };
}

export function getExecutionOrder(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ExecutionNode[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const adj = new Map<string, string[]>();
  const inDeg = new Map<string, number>();

  for (const n of nodes) {
    adj.set(n.id, []);
    inDeg.set(n.id, 0);
  }

  for (const e of edges) {
    adj.get(e.source)?.push(e.target);
    inDeg.set(e.target, (inDeg.get(e.target) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const n of nodes) {
    if ((inDeg.get(n.id) ?? 0) === 0) queue.push(n.id);
  }

  const result: ExecutionNode[] = [];
  let order = 0;

  while (queue.length > 0) {
    const u = queue.shift()!;
    const node = nodeMap.get(u);
    if (node) {
      result.push({ id: u, nodeType: node.data.nodeType, order: order++ });
    }
    for (const v of adj.get(u) ?? []) {
      const deg = (inDeg.get(v) ?? 1) - 1;
      inDeg.set(v, deg);
      if (deg === 0) queue.push(v);
    }
  }

  return result;
}

export function getUpstreamOutputs(
  nodeId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const incomingEdges = edges.filter((e) => e.target === nodeId);

  for (const edge of incomingEdges) {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    if (!sourceNode) continue;
    const sourceData = sourceNode.data as WorkflowNodeData;
    const targetHandle = edge.targetHandle ?? "input";

    if (sourceData.output?.value) {
      result[targetHandle] = sourceData.output.value;
    }

    const sourceFields = sourceData.fields ?? {};
    if (sourceData.nodeType === "prompt" && sourceFields.text) {
      result[targetHandle] = result[targetHandle] ?? sourceFields.text;
    }
    if (
      (sourceData.nodeType === "image-input" || sourceData.nodeType === "video-input") &&
      sourceFields.file
    ) {
      result[targetHandle] = result[targetHandle] ?? sourceFields.file;
    }
  }

  return result;
}
