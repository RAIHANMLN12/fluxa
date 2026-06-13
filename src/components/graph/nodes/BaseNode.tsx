"use client";

import { type ReactNode } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { WorkflowNodeData } from "@/types/workflow";
import { nodeRegistry } from "@/lib/nodes";
import { useWorkflowStore } from "@/store/workflow-store";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface BaseNodeWrapperProps extends NodeProps {
  children: ReactNode;
}

interface StateStyle {
  icon: ReactNode;
  className: string;
}

const stateStyles: Record<string, StateStyle> = {
  running: { icon: <Loader2 size={11} className="animate-spin" />, className: "text-[#0a84ff]" },
  completed: { icon: <CheckCircle size={11} />, className: "text-[#30d158]" },
  error: { icon: <AlertCircle size={11} />, className: "text-[#ff453a]" },
};

export function BaseNodeWrapper({ id, data, selected, children }: BaseNodeWrapperProps) {
  const nodeData = data as unknown as WorkflowNodeData;
  const def = nodeRegistry.get(nodeData.nodeType);
  const removeNode = useWorkflowStore((s) => s.removeNode);
  const executionState = useWorkflowStore((s) => s.executionStates[id]);
  const ports = def?.ports ?? [];
  const inputPorts = ports.filter((p) => p.direction === "input");
  const outputPorts = ports.filter((p) => p.direction === "output");

  const stateIndicator = executionState ? stateStyles[executionState] : null;

  return (
    <div
      className="rounded-xl transition-all duration-200 min-w-[230px]"
      style={{
        background: selected
          ? "linear-gradient(180deg, #2c2c2e, #252527)"
          : "linear-gradient(180deg, #252527, #222224)",
        border: executionState === "error"
          ? "0.5px solid rgba(255, 69, 58, 0.5)"
          : selected
          ? "0.5px solid rgba(10, 132, 255, 0.4)"
          : "0.5px solid #38383a",
        boxShadow: executionState === "error"
          ? "0 2px 12px rgba(255, 69, 58, 0.15), inset 0 1px 0 rgba(255,255,255,0.06)"
          : selected
          ? "0 2px 12px rgba(10, 132, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 1px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      onClick={() => useWorkflowStore.getState().selectNode(id)}
    >
      {inputPorts.map((port, i) => (
        <Handle
          key={port.id}
          type="target"
          position={Position.Left}
          id={port.id}
          style={{
            top: ((i + 1) / (inputPorts.length + 1)) * 100 + "%",
            width: 8,
            height: 8,
            border: "2px solid " + (selected ? "#0a84ff" : "#48484a"),
            backgroundColor: selected ? "#0a84ff" : "#1c1c1e",
            boxShadow: selected ? "0 0 6px rgba(10, 132, 255, 0.4)" : "none",
          }}
        />
      ))}

      <div className="flex items-center justify-between px-3.5 py-2.5 select-none">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: nodeData.color || "#0a84ff" }}
          />
          <span className="text-[13px] font-semibold text-[#f5f5f7] tracking-tight">
            {nodeData.label}
          </span>
          {stateIndicator && (
            <span className={stateIndicator.className}>{stateIndicator.icon}</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeNode(id);
          }}
          className="p-0.5 rounded text-[#48484a] hover:text-[#98989d] hover:bg-[#3a3a3c] transition-all"
        >
          <X size={12} />
        </button>
      </div>

      <div className="px-3.5 pb-3.5 space-y-2">{children}</div>

      {outputPorts.map((port, i) => (
        <Handle
          key={port.id}
          type="source"
          position={Position.Right}
          id={port.id}
          style={{
            top: ((i + 1) / (outputPorts.length + 1)) * 100 + "%",
            width: 8,
            height: 8,
            border: "2px solid " + (selected ? "#0a84ff" : "#48484a"),
            backgroundColor: selected ? "#0a84ff" : "#1c1c1e",
            boxShadow: selected ? "0 0 6px rgba(10, 132, 255, 0.4)" : "none",
          }}
        />
      ))}
    </div>
  );
}
