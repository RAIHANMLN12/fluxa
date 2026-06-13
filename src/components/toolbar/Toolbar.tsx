"use client";

import { useState, useEffect } from "react";
import { Play, Square, Save, FolderOpen, PanelLeft, PanelRight, X, Terminal, Settings, Key } from "lucide-react";
import { useWorkflowStore } from "@/store/workflow-store";
import { useUIStore } from "@/store/ui-store";
import { serializeWorkflow, deserializeWorkflow } from "@/lib/nodes";
import { runWorkflow } from "@/lib/workflow/run";
import type { Workflow } from "@/types/workflow";

interface WorkflowListItem {
  id: string;
  name: string;
  updatedAt: string;
}

function LoadDialog({ onClose }: { onClose: () => void }) {
  const [workflows, setWorkflows] = useState<WorkflowListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);

  useEffect(() => {
    fetch("/api/workflows")
      .then((r) => r.json())
      .then((data) => setWorkflows(data.workflows ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleLoad = async (id: string) => {
    const res = await fetch("/api/workflows/" + id);
    if (!res.ok) return;
    const wf: Workflow = await res.json();
    const parsed = deserializeWorkflow(wf);
    loadWorkflow(parsed.nodes, parsed.edges, parsed.id, parsed.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-[#222224] border-[0.5px] border-[#38383a] rounded-xl w-96 max-h-96 flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#38383a]">
          <h3 className="text-base font-semibold text-[#f5f5f7]">Load Workflow</h3>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-[#2c2c2e] text-[#6c6c70] hover:text-[#98989d] transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <p className="text-sm text-[#6c6c70] text-center py-8">Loading...</p>
          ) : workflows.length === 0 ? (
            <p className="text-sm text-[#6c6c70] text-center py-8">No saved workflows</p>
          ) : (
            <div className="space-y-0.5">
              {workflows.map((wf) => (
                <button
                  key={wf.id}
                  onClick={() => handleLoad(wf.id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[#98989d] hover:text-[#f5f5f7] hover:bg-[#2c2c2e] transition-colors"
                >
                  <div className="font-medium">{wf.name}</div>
                  <div className="text-[10px] text-[#6c6c70] mt-0.5">
                    {new Date(wf.updatedAt).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsDialog({ onClose }: { onClose: () => void }) {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => {
        if (d.openrouterApiKey === "configured") {
          setApiKey("configured");
        }
      });
  }, []);

  const handleSave = async () => {
    if (apiKey === "configured" || !apiKey.trim()) {
      onClose();
      return;
    }
    setError("");
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ openrouterApiKey: apiKey.trim() }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => onClose(), 1000);
    } else {
      setError("Failed to save API key");
    }
  };

  const handleRemove = async () => {
    await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ openrouterApiKey: "" }),
    });
    setApiKey("");
    setSaved(true);
    setTimeout(() => onClose(), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-[#222224] border-[0.5px] border-[#38383a] rounded-xl w-96 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#38383a]">
          <h3 className="text-base font-semibold text-[#f5f5f7]">Settings</h3>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-[#2c2c2e] text-[#6c6c70] hover:text-[#98989d] transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs text-[#98989d] mb-2 font-semibold">
              <Key size={13} /> OpenRouter API Key
            </label>
            {apiKey === "configured" ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#30d158]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
                  API key configured
                </div>
                <button
                  onClick={handleRemove}
                  className="text-xs text-[#ff453a] hover:text-[#ff453a]/80 transition-colors"
                >
                  Remove key
                </button>
              </div>
            ) : (
              <>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full bg-[#1c1c1e] text-[#f5f5f7] text-xs rounded-lg p-2.5 border-[0.5px] border-[#38383a] placeholder-[#6c6c70] focus:outline-none focus:border-[#0a84ff] transition-colors"
                />
                {error && <p className="text-xs text-[#ff453a] mt-1">{error}</p>}
              </>
            )}
          </div>

          <div className="text-[10px] text-[#6c6c70] leading-relaxed">
            Get your API key from{" "}
            <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer"
              className="text-[#0a84ff] hover:underline">
              openrouter.ai/keys
            </a>
            . Without a key, the app uses mock generation.
          </div>

          {saved && (
            <p className="text-xs text-[#30d158] text-center">Saved!</p>
          )}

          {apiKey !== "configured" && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 px-3 py-2 rounded-lg text-xs text-[#6c6c70] hover:text-[#98989d] hover:bg-[#2c2c2e] transition-colors border-[0.5px] border-[#38383a]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#0a84ff] hover:bg-[#0a84ff]/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Toolbar() {
  const [showLoad, setShowLoad] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState("");
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const workflowId = useWorkflowStore((s) => s.workflowId);
  const setWorkflowInfo = useWorkflowStore((s) => s.setWorkflowInfo);
  const reset = useWorkflowStore((s) => s.reset);
  const isDirty = useWorkflowStore((s) => s.isDirty);
  const isExecuting = useWorkflowStore((s) => s.isExecuting);
  const executionLog = useWorkflowStore((s) => s.executionLog);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const inspectorOpen = useUIStore((s) => s.inspectorOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const toggleInspector = useUIStore((s) => s.toggleInspector);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => setApiKeyStatus(d.openrouterApiKey || ""));
  }, []);

  const handleSave = async () => {
    const wf = serializeWorkflow(workflowName, "", nodes, edges);
    if (workflowId) wf.id = workflowId;
    const res = await fetch("/api/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wf),
    });
    if (res.ok) {
      setWorkflowInfo(wf.id, wf.name);
      useWorkflowStore.getState().setIsDirty(false);
    }
  };

  const handleNew = () => reset();
  const handleRun = () => runWorkflow();
  const handleStop = () => useWorkflowStore.getState().setIsExecuting(false);

  return (
    <>
      <div className="h-12 bg-[#1c1c1e] border-b border-[#38383a] flex items-center px-4 gap-1">
        <button
          onClick={toggleSidebar}
          className={"p-2 rounded-md transition-colors " + (sidebarOpen ? "text-[#0a84ff]" : "text-[#6c6c70] hover:text-[#98989d] hover:bg-[#2c2c2e]")}
          title="Toggle Sidebar"
        >
          <PanelLeft size={16} />
        </button>

        <div className="w-px h-5 bg-[#38383a] mx-2" />

        <button
          onClick={handleNew}
          disabled={isExecuting}
          className="px-3 py-1.5 rounded-md text-sm text-[#6c6c70] hover:text-[#98989d] hover:bg-[#2c2c2e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          New
        </button>
        <button
          onClick={handleSave}
          disabled={nodes.length === 0 || isExecuting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-[#6c6c70] hover:text-[#98989d] hover:bg-[#2c2c2e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Save size={15} />
          Save
          {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-[#0a84ff]" />}
        </button>
        <button
          onClick={() => setShowLoad(true)}
          disabled={isExecuting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-[#6c6c70] hover:text-[#98989d] hover:bg-[#2c2c2e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FolderOpen size={15} />
          Load
        </button>

        <div className="w-px h-5 bg-[#38383a] mx-2" />

        <div className="flex-1" />

        {isExecuting ? (
          <button
            onClick={handleStop}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#ff453a] text-white hover:bg-[#ff453a]/90 transition-all text-sm font-semibold shadow-sm"
          >
            <Square size={14} />
            Stop
          </button>
        ) : (
          <button
            onClick={handleRun}
            disabled={nodes.length === 0}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#0a84ff] text-white hover:bg-[#0a84ff]/90 transition-all text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
          >
            <Play size={14} />
            Run
          </button>
        )}

        <button
          onClick={() => setShowLog(!showLog)}
          className={"p-2 rounded-md transition-colors " + (showLog ? "text-[#0a84ff]" : "text-[#6c6c70] hover:text-[#98989d] hover:bg-[#2c2c2e]")}
          title="Execution Log"
        >
          <Terminal size={15} />
        </button>

        <div className="w-px h-5 bg-[#38383a] mx-2" />

        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-md transition-colors text-[#6c6c70] hover:text-[#98989d] hover:bg-[#2c2c2e] relative"
          title="Settings"
        >
          <Settings size={15} />
          {apiKeyStatus === "configured" && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#30d158]" />
          )}
        </button>

        <button
          onClick={toggleInspector}
          className={"p-2 rounded-md transition-colors " + (inspectorOpen ? "text-[#0a84ff]" : "text-[#6c6c70] hover:text-[#98989d] hover:bg-[#2c2c2e]")}
          title="Toggle Inspector"
        >
          <PanelRight size={16} />
        </button>
      </div>

      {showLog && executionLog.length > 0 && (
        <div className="h-36 bg-[#151517] border-b border-[#38383a] overflow-y-auto">
          <div className="px-4 py-2.5 space-y-0.5">
            {executionLog.map((msg, i) => (
              <div key={i} className="text-xs font-mono text-[#98989d] leading-6">
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {showLoad && <LoadDialog onClose={() => setShowLoad(false)} />}
      {showSettings && <SettingsDialog onClose={() => setShowSettings(false)} />}
    </>
  );
}
