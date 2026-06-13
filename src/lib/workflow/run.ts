import { validateGraph, getExecutionOrder, getUpstreamOutputs } from "./engine";
import { getExecutor } from "./executor";
import { useWorkflowStore } from "@/store/workflow-store";

export async function runWorkflow() {
  const store = useWorkflowStore.getState();
  const { nodes, edges } = store;

  store.clearLog();
  store.addLog("Starting execution...");

  const validation = validateGraph(nodes, edges);
  if (!validation.valid) {
    for (const err of validation.errors) {
      store.addLog("W " + err);
    }
    store.addLog("X Execution aborted");
    return;
  }

  store.addLog("V Graph validated (" + nodes.length + " nodes, " + edges.length + " edges)");

  const execOrder = getExecutionOrder(nodes, edges);
  store.addLog("V Execution order: " + execOrder.map((e) => e.order + 1).join(" -> "));

  store.setAllExecutionStates(
    Object.fromEntries(nodes.map((n) => [n.id, "idle" as const]))
  );
  store.setIsExecuting(true);

  for (let i = 0; i < execOrder.length; i++) {
    if (!useWorkflowStore.getState().isExecuting) {
      store.addLog("Execution stopped by user");
      break;
    }

    const execNode = execOrder[i];
    const currentNodes = useWorkflowStore.getState().nodes;
    const node = currentNodes.find((n) => n.id === execNode.id);
    if (!node) continue;

    store.setExecutionState(execNode.id, "running");
    store.addLog("> [" + (i + 1) + "/" + execOrder.length + "] Running: " + node.data.label);

    try {
      const currentEdges = useWorkflowStore.getState().edges;
      const inputs = getUpstreamOutputs(execNode.id, currentNodes, currentEdges);
      const executor = getExecutor(node.data.nodeType);

      if (executor) {
        const result = await executor(node.data, inputs);

        if (!useWorkflowStore.getState().isExecuting) {
          store.addLog("Execution stopped by user");
          break;
        }
        store.setNodeOutput(execNode.id, result.type, result.value);
        store.setExecutionState(execNode.id, "completed");
        store.addLog("V Completed: " + node.data.label);
      } else {
        store.setExecutionState(execNode.id, "error");
        store.addLog("W No executor for: " + node.data.label);
      }
    } catch (err) {
      store.setExecutionState(execNode.id, "error");
      store.addLog("X Error: " + node.data.label + " - " + err);
    }

    const updatedNode = useWorkflowStore.getState().nodes.find((n) => n.id === execNode.id);
    if (updatedNode?.data?.output?.value) {
      const val = updatedNode.data.output.value;
      store.addLog("  Output: " + val.slice(0, 80) + (val.length > 80 ? "..." : ""));
    }
  }

  store.setIsExecuting(false);
  store.addLog("V Workflow complete");
}
