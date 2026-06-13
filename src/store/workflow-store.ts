"use client";

import { create } from "zustand";
import {
  type WorkflowNode,
  type WorkflowEdge,
  type NodeExecutionState,
} from "@/types/workflow";
import {
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  workflowName: string;
  workflowId: string | null;
  isDirty: boolean;
  executionStates: Record<string, NodeExecutionState>;
  isExecuting: boolean;
  executionLog: string[];
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: WorkflowNode) => void;
  removeNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  updateNodeField: (nodeId: string, fieldName: string, value: unknown) => void;
  setWorkflowInfo: (id: string, name: string) => void;
  loadWorkflow: (nodes: WorkflowNode[], edges: WorkflowEdge[], id: string, name: string) => void;
  reset: () => void;
  setIsDirty: (dirty: boolean) => void;
  setExecutionState: (nodeId: string, state: NodeExecutionState) => void;
  setNodeOutput: (nodeId: string, type: "text" | "image" | "video" | null, value: string | null) => void;
  setAllExecutionStates: (states: Record<string, NodeExecutionState>) => void;
  setIsExecuting: (executing: boolean) => void;
  addLog: (msg: string) => void;
  clearLog: () => void;
  clearExecutionStates: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  workflowName: "Untitled Workflow",
  workflowId: null,
  isDirty: false,
  executionStates: {},
  isExecuting: false,
  executionLog: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[], isDirty: true });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) as WorkflowEdge[], isDirty: true });
  },

  onConnect: (connection) => {
    set({ edges: addEdge(connection, get().edges) as WorkflowEdge[], isDirty: true });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node], isDirty: true });
  },

  removeNode: (id) => {
    const { [id]: _, ...rest } = get().executionStates;
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
      executionStates: rest,
      isDirty: true,
    });
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodeField: (nodeId, fieldName, value) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, fields: { ...n.data.fields, [fieldName]: value } } }
          : n
      ),
      isDirty: true,
    });
  },

  setWorkflowInfo: (id, name) => set({ workflowId: id, workflowName: name }),

  loadWorkflow: (nodes, edges, id, name) =>
    set({ nodes, edges, workflowId: id, workflowName: name, isDirty: false, executionStates: {} }),

  reset: () =>
    set({
      nodes: [], edges: [], selectedNodeId: null,
      workflowId: null, workflowName: "Untitled Workflow",
      isDirty: false, executionStates: {}, isExecuting: false, executionLog: [],
    }),

  setIsDirty: (dirty) => set({ isDirty: dirty }),

  setExecutionState: (nodeId, state) =>
    set({
      executionStates: { ...get().executionStates, [nodeId]: state },
    }),

  setNodeOutput: (nodeId, type, value) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, output: { type, value } } }
          : n
      ),
    }),

  setAllExecutionStates: (states) => set({ executionStates: states }),

  setIsExecuting: (executing) => set({ isExecuting: executing }),

  addLog: (msg) =>
    set({ executionLog: [...get().executionLog, `[${new Date().toLocaleTimeString()}] ${msg}`] }),

  clearLog: () => set({ executionLog: [] }),

  clearExecutionStates: () => set({ executionStates: {}, isExecuting: false }),
}));
