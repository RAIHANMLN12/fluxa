"use client";

import { type NodeProps } from "@xyflow/react";
import { BaseNodeWrapper } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflow-store";
import type { WorkflowNodeData } from "@/types/workflow";

export function TextModelNode(props: NodeProps) {
  const { id, data } = props;
  const nodeData = data as unknown as WorkflowNodeData;
  const updateNodeField = useWorkflowStore((s) => s.updateNodeField);
  const fields = nodeData.fields ?? {};
  const provider = (fields.provider as string) ?? "openai";
  const output = nodeData.output;

  return (
    <BaseNodeWrapper {...props}>
      <div className="space-y-2">
        <div>
          <label className="block text-[10px] text-[#6c6c70] mb-1 font-semibold">Provider</label>
          <select
            value={provider}
            onChange={(e) => updateNodeField(id, "provider", e.target.value)}
            className="w-full bg-[#222224] text-[#f5f5f7] text-xs rounded-lg p-2 border-[0.5px] border-[#38383a] focus:outline-none focus:border-[#0a84ff] transition-colors"
          >
            <option value="openai">OpenAI (GPT-4o)</option>
            <option value="claude">Anthropic (Claude)</option>
            <option value="gemini">Google (Gemini)</option>
          </select>
        </div>
        <div className="text-[10px] text-[#6c6c70] italic leading-tight">
          Enhances prompt from input → passes to output
        </div>
      </div>

      {output?.type === "text" && output.value && (
        <div className="mt-2.5 pt-2.5 border-t border-[#38383a]">
          <label className="block text-[10px] text-[#6c6c70] mb-1.5 uppercase tracking-wider font-semibold">Enhanced</label>
          <div className="bg-[#222224] text-[#f5f5f7] text-xs rounded-lg p-2.5 max-h-24 overflow-y-auto whitespace-pre-wrap break-words">
            {output.value}
          </div>
        </div>
      )}
    </BaseNodeWrapper>
  );
}
