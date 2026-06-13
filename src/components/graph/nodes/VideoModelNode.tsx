"use client";

import { type NodeProps } from "@xyflow/react";
import { BaseNodeWrapper } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflow-store";
import type { WorkflowNodeData } from "@/types/workflow";
import { ASPECT_RATIOS } from "@/types/nodes";

export function VideoModelNode(props: NodeProps) {
  const { id, data } = props;
  const nodeData = data as unknown as WorkflowNodeData;
  const updateNodeField = useWorkflowStore((s) => s.updateNodeField);
  const fields = nodeData.fields ?? {};
  const aspectRatio = (fields.aspectRatio as string) ?? "16:9";
  const duration = (fields.duration as number) ?? 5;
  const output = nodeData.output;

  return (
    <BaseNodeWrapper {...props}>
      <div className="space-y-2.5">
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
        <div>
          <label className="block text-[10px] text-[#6c6c70] mb-1 font-semibold">Duration (s)</label>
          <input
            type="number"
            min="1"
            max="30"
            value={duration}
            onChange={(e) => updateNodeField(id, "duration", parseInt(e.target.value) || 5)}
            className="w-full bg-[#222224] text-[#f5f5f7] text-xs rounded-lg p-2 border-[0.5px] border-[#38383a] focus:outline-none focus:border-[#0a84ff] transition-colors"
          />
        </div>
      </div>

      {output?.type === "video" && output.value && (
        <div className="mt-2.5 pt-2.5 border-t border-[#38383a]">
          <label className="block text-[10px] text-[#6c6c70] mb-1.5 uppercase tracking-wider font-semibold">Output</label>
          <video src={output.value} controls className="w-full rounded-lg" />
        </div>
      )}
    </BaseNodeWrapper>
  );
}
