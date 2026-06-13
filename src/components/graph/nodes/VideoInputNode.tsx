"use client";

import { useRef } from "react";
import { type NodeProps } from "@xyflow/react";
import { BaseNodeWrapper } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflow-store";
import { X, VideoIcon } from "lucide-react";

export function VideoInputNode(props: NodeProps) {
  const { id, data } = props;
  const updateNodeField = useWorkflowStore((s) => s.updateNodeField);
  const fileValue = (data.fields as Record<string, unknown>)?.file as string | null ?? null;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateNodeField(id, "file", e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <BaseNodeWrapper {...props}>
      {fileValue ? (
        <div className="relative">
          <video
            src={fileValue}
            className="w-full h-28 object-cover rounded-lg"
            controls
          />
          <button
            onClick={() => updateNodeField(id, "file", null)}
            className="absolute top-1.5 right-1.5 p-1 bg-[#1c1c1e]/80 backdrop-blur rounded-md hover:bg-[#1c1c1e] transition-colors border-[0.5px] border-[#38383a]"
          >
            <X size={12} className="text-[#f5f5f7]" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center h-24 border-[0.5px] border-dashed border-[#38383a] rounded-lg cursor-pointer hover:border-[#48484a] transition-colors bg-[#222224]"
        >
          <VideoIcon size={18} className="text-[#6c6c70] mb-1" />
          <span className="text-[10px] text-[#6c6c70]">Click to upload</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </BaseNodeWrapper>
  );
}
