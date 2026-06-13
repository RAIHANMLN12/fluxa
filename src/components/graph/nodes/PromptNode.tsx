"use client";

import { type NodeProps } from "@xyflow/react";
import { BaseNodeWrapper } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflow-store";

export function PromptNode(props: NodeProps) {
  const { id, data } = props;
  const updateNodeField = useWorkflowStore((s) => s.updateNodeField);
  const value = (data.fields as Record<string, unknown>)?.text as string ?? "";

  return (
    <BaseNodeWrapper {...props}>
      <textarea
        value={value}
        onChange={(e) => updateNodeField(id, "text", e.target.value)}
        placeholder="Enter your prompt…"
        className="w-full min-h-[72px] bg-[#222224] text-[#f5f5f7] text-xs rounded-lg p-2.5 border-[0.5px] border-[#38383a] placeholder-[#6c6c70] focus:outline-none focus:border-[#0a84ff] resize-none transition-colors"
        rows={3}
      />
    </BaseNodeWrapper>
  );
}
