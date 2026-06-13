"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore } from "@/store/workflow-store";
import { PromptNode } from "./nodes/PromptNode";
import { ImageInputNode } from "./nodes/ImageInputNode";
import { VideoInputNode } from "./nodes/VideoInputNode";
import { TextModelNode } from "./nodes/TextModelNode";
import { ImageModelNode } from "./nodes/ImageModelNode";
import { VideoModelNode } from "./nodes/VideoModelNode";
import { nodeRegistry } from "@/lib/nodes/registry";

function buildNodeTypes(): NodeTypes {
  const types: NodeTypes = {
    prompt: PromptNode,
    "image-input": ImageInputNode,
    "video-input": VideoInputNode,
    "prompt-enhancer": TextModelNode,

  };

  for (const def of nodeRegistry.getByCategory("image-model")) {
    types[def.type] = ImageModelNode;
  }
  for (const def of nodeRegistry.getByCategory("video-model")) {
    types[def.type] = VideoModelNode;
  }

  return types;
}

const defaultEdgeOptions = {
  style: { stroke: "#48484a", strokeWidth: 1.5 },
  type: "smoothstep",
  animated: true,
};

export function Canvas() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const nodeTypes = useMemo(() => buildNodeTypes(), []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/fluxa-node-type");
      if (!nodeType) return;

      const def = nodeRegistry.get(nodeType);
      if (!def) return;

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 100,
      };

      const addNode = useWorkflowStore.getState().addNode;
      const defaultFields: Record<string, unknown> = {};
      for (const field of def.fields) {
        defaultFields[field.name] = field.default ?? "";
      }

      addNode({
        id: "node-" + Date.now(),
        type: nodeType,
        position,
        data: {
          nodeType: def.type,
          label: def.label,
          fields: defaultFields,
          output: { type: null, value: null },
          color: def.color,
          icon: def.icon,
        },
      });
    },
    []
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        colorMode="dark"
        panOnDrag={[1, 2]}
        selectNodesOnDrag={false}
        deleteKeyCode={["Backspace", "Delete"]}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.5} color="#222224" />
        <Controls showInteractive={false} position="bottom-left" />
        <MiniMap
          nodeColor="#3a3a3c"
          nodeBorderRadius={4}
          maskColor="rgba(21,21,23,0.6)"
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
}

