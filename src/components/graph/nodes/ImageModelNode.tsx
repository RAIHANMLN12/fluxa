"use client";

import { type NodeProps } from "@xyflow/react";
import { BaseNodeWrapper } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflow-store";
import type { WorkflowNodeData } from "@/types/workflow";
import { ASPECT_RATIOS } from "@/types/nodes";

export function ImageModelNode(props: NodeProps) {
  const { id, data } = props;
  const nodeData = data as unknown as WorkflowNodeData;
  const updateNodeField = useWorkflowStore((s) => s.updateNodeField);
  const fields = nodeData.fields ?? {};
  const aspectRatio = (fields.aspectRatio as string) ?? "1:1";
  const output = nodeData.output;

  return (
    <BaseNodeWrapper {...props}>
      <div>
        <label className="block text-[10px] text-[#6c6c70] mb-1 font-semibold">Aspect Ratio</label>
        <select
          value={aspectRatio}
          onChange={(e) => updateNodeField(id, "aspectRatio", e.target.value)}
          className="w-full bg-[#222224] text-[#f5f5f7] text-xs rounded-lg p-2 border-[0.5px] border-[#38383a] focus:outline-none focus:border-[#0a84ff] transition-colors"
        >
          {ASPECT_RATIOS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {output?.type === "image" && output.value && (
        <div className="mt-2.5 pt-2.5 border-t border-[#38383a]">
          <label className="block text-[10px] text-[#6c6c70] mb-1.5 uppercase tracking-wider font-semibold">Output</label>
          <img
            src={output.value}
            alt="Generated"
            className="w-full rounded-lg object-cover"
          />
        </div>
      )}
    </BaseNodeWrapper>
  );
}
