"use client";

import { useWorkflowStore } from "@/store/workflow-store";
import { nodeRegistry } from "@/lib/nodes";
import type { FieldDefinition } from "@/types/nodes";

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDefinition;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full bg-[#222224] text-[#f5f5f7] text-xs rounded-lg p-2.5 border-[0.5px] border-[#38383a] placeholder-[#6c6c70] focus:outline-none focus:border-[#0a84ff] resize-none transition-colors"
          rows={3}
        />
      );
    case "number":
      return (
        <input
          type="number"
          value={(value as number) ?? 0}
          min={field.min}
          max={field.max}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-[#222224] text-[#f5f5f7] text-xs rounded-lg p-2 border-[0.5px] border-[#38383a] focus:outline-none focus:border-[#0a84ff] transition-colors"
        />
      );
    case "select":
      return (
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#222224] text-[#f5f5f7] text-xs rounded-lg p-2 border-[0.5px] border-[#38383a] focus:outline-none focus:border-[#0a84ff] transition-colors"
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case "slider":
      return (
        <div className="flex items-center gap-2.5">
          <input
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 1}
            step={field.step ?? 0.1}
            value={(value as number) ?? 0}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-[11px] text-[#6c6c70] w-8 text-right tabular-nums">
            {Number(value ?? 0).toFixed(1)}
          </span>
        </div>
      );
    default:
      return (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full bg-[#222224] text-[#f5f5f7] text-xs rounded-lg p-2 border-[0.5px] border-[#38383a] placeholder-[#6c6c70] focus:outline-none focus:border-[#0a84ff] transition-colors"
        />
      );
  }
}

export function InspectorPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeField = useWorkflowStore((s) => s.updateNodeField);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  if (!selectedNode) {
    return (
      <div className="w-72 h-full bg-[#1c1c1e] border-l border-[#38383a] flex items-center justify-center">
        <p className="text-xs text-[#6c6c70]">Select a node to inspect</p>
      </div>
    );
  }

  const def = nodeRegistry.get(selectedNode.data.nodeType);
  if (!def) {
    return (
      <div className="w-72 h-full bg-[#1c1c1e] border-l border-[#38383a] flex items-center justify-center">
        <p className="text-xs text-[#6c6c70]">Unknown node type</p>
      </div>
    );
  }

  const fields = (selectedNode.data.fields as Record<string, unknown>) ?? {};
  const allFields = [...(def.inspectorFields ?? [])];

  return (
    <div className="w-72 h-full bg-[#1c1c1e] border-l border-[#38383a] flex flex-col overflow-y-auto">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#38383a]">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: def.color }}
        />
        <span className="text-sm font-semibold text-[#f5f5f7]">{def.label}</span>
      </div>

      <div className="p-4 space-y-5">
        <div>
          <label className="block text-[10px] text-[#6c6c70] uppercase tracking-widest mb-2.5 font-semibold">
            Info
          </label>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#6c6c70]">Type</span>
              <span className="text-[#98989d]">{def.type}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#6c6c70]">ID</span>
              <span className="text-[#98989d] font-mono text-[10px]">{selectedNode.id.slice(0, 12)}…</span>
            </div>
          </div>
        </div>

        {allFields.length > 0 && <div className="h-px bg-[#38383a]" />}

        {allFields.length > 0 && (
          <div>
            <label className="block text-[10px] text-[#6c6c70] uppercase tracking-widest mb-3 font-semibold">
              Settings
            </label>
            <div className="space-y-4">
              {allFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs text-[#98989d] mb-1.5 font-medium">
                    {field.label}
                  </label>
                  <FieldRenderer
                    field={field}
                    value={fields[field.name] ?? field.default}
                    onChange={(val) => updateNodeField(selectedNode.id, field.name, val)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {allFields.length === 0 && (
          <p className="text-xs text-[#6c6c70]">No additional settings</p>
        )}
      </div>
    </div>
  );
}
