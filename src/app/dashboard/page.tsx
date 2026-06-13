"use client";

import dynamic from "next/dynamic";
import { NodePalette } from "@/components/sidebar/NodePalette";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { InspectorPanel } from "@/components/inspector/InspectorPanel";
import { useUIStore } from "@/store/ui-store";

const Canvas = dynamic(
  () => import("@/components/graph/Canvas").then((m) => ({ default: m.Canvas })),
  { ssr: false }
);

export default function DashboardPage() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const inspectorOpen = useUIStore((s) => s.inspectorOpen);

  return (
    <div className="h-full flex flex-col bg-[#0f0f1a]">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && <NodePalette />}
        <main className="flex-1 relative">
          <Canvas />
        </main>
        {inspectorOpen && <InspectorPanel />}
      </div>
    </div>
  );
}
