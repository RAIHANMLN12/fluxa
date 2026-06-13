"use client";

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  inspectorOpen: boolean;
  searchQuery: string;
  executionStatus: "idle" | "running" | "completed" | "error";
  executionLog: string[];
  toggleSidebar: () => void;
  toggleInspector: () => void;
  setSearchQuery: (q: string) => void;
  setExecutionStatus: (status: "idle" | "running" | "completed" | "error") => void;
  addLog: (msg: string) => void;
  clearLog: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  inspectorOpen: true,
  searchQuery: "",
  executionStatus: "idle",
  executionLog: [],

  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
  toggleInspector: () => set({ inspectorOpen: !get().inspectorOpen }),

  setSearchQuery: (q) => set({ searchQuery: q }),

  setExecutionStatus: (status) => set({ executionStatus: status }),

  addLog: (msg) => set({ executionLog: [...get().executionLog, `[${new Date().toLocaleTimeString()}] ${msg}`] }),

  clearLog: () => set({ executionLog: [] }),
}));
