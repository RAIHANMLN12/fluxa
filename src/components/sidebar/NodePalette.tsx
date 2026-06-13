"use client";

import { useMemo, useState } from "react";
import { nodeRegistry } from "@/lib/nodes";
import type { NodeCategory } from "@/types/nodes";
import { useUIStore } from "@/store/ui-store";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

const categoryConfig: Record<NodeCategory, { label: string }> = {
  input: { label: "Inputs" },
  "image-model": { label: "Image Models" },
  "video-model": { label: "Video Models" },
};

const categoryOrder: NodeCategory[] = ["input", "image-model", "video-model"];

function CategorySection({
  category,
  search,
  collapsed,
  onToggle,
}: {
  category: NodeCategory;
  search: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const defs = useMemo(() => nodeRegistry.getByCategory(category), [category]);
  const filtered = defs.filter(
    (d) =>
      d.label.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase())
  );

  if (filtered.length === 0) return null;

  const config = categoryConfig[category];

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 w-full px-3 py-1.5 text-[11px] font-semibold text-[#6c6c70] uppercase tracking-widest hover:text-[#98989d] transition-colors"
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
        {config.label}
      </button>
      {!collapsed && (
        <div className="grid grid-cols-2 gap-1 px-3">
          {filtered.map((def) => (
            <div
              key={def.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/fluxa-node-type", def.type);
                e.dataTransfer.effectAllowed = "move";
              }}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing bg-[#222224] hover:bg-[#2c2c2e] border-[0.5px] border-[#38383a] hover:border-[#48484a] transition-all text-xs text-[#98989d] hover:text-[#f5f5f7] select-none"
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: def.color }}
              />
              <span className="leading-tight font-medium">{def.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function NodePalette() {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="w-72 h-full bg-[#1c1c1e] border-r border-[#38383a] flex flex-col select-none">
      <div className="px-4 pt-3 pb-2.5 border-b border-[#38383a]">
        <h2 className="text-[11px] font-semibold text-[#6c6c70] uppercase tracking-widest mb-2.5">
          Nodes
        </h2>
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6c6c70]"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#222224] text-[#f5f5f7] text-xs rounded-lg pl-8 pr-3 py-1.5 border-[0.5px] border-[#38383a] placeholder-[#6c6c70] focus:outline-none focus:border-[#0a84ff] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {categoryOrder.map((cat) => (
          <CategorySection
            key={cat}
            category={cat}
            search={searchQuery}
            collapsed={collapsedCategories.has(cat)}
            onToggle={() => toggleCategory(cat)}
          />
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-[#38383a] text-[10px] text-[#6c6c70] text-center">
        Drag nodes onto canvas
      </div>
    </div>
  );
}
