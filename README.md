# Fluxa — Node-Based Multimodal AI Workflow Platform

Fluxa is a visual, node-based AI workflow platform that lets you chain multimodal AI models — text, image, and video — through an interactive canvas. Drag nodes, connect them, and execute complex generative pipelines without writing code.

Built with Next.js, React Flow, TypeScript, Tailwind CSS, and Zustand.

---

## Features

### Visual Canvas
- **React Flow** canvas with custom, dark-themed node cards
- Drag-and-drop nodes from the sidebar onto the canvas
- Connect nodes via port-to-port edges (smoothstep, animated)
- Select, move, delete nodes with keyboard or UI
- Node selection glow with blue accent

### Node System
- **Input Nodes**: Prompt (textarea), Image upload, Video upload
- **Text Model Nodes**: GPT-4o, Claude, Gemini, **Prompt Enhancer** (unified UI with provider dropdown)
- **Image Model Nodes**: DALL·E 3, Stable Diffusion 3, Flux Pro
- **Video Model Nodes**: Runway Gen-3, Pika 2.0, Kling 1.6
- Each node has inline form fields and optional inspector panel for advanced settings
- Output renders directly inside the model card — no separate output nodes needed

### Workflow Engine
- **Graph validation**: cycle detection (DFS), orphan node detection, edge integrity checks
- **Topological sort**: Kahn's algorithm for DAG execution ordering
- **Data routing**: automatically passes upstream outputs as inputs to downstream nodes
- **Execution state machine**: idle → running → completed/error per node
- Real-time visual feedback: animated spinner, green checkmark, red alert per node
- Execution log panel with timestamps

### AI Integration (OpenRouter)
- Server-side proxy to OpenRouter API (key stored in `data/config.json`)
- Text generation via `/v1/chat/completions`
- Image generation supported for compatible models
- **Automatic mock fallback**: if no API key configured, the app falls back to placeholder SVG generation — fully functional offline
- Configurable model-to-node mapping in `executor.ts`

### Storage
- Local JSON file storage (`data/workflows/*.json`)
- Save, load, list, and delete workflows
- Config storage (`data/config.json`) for API keys
- No database required — single-user, local-first

### UI
- **Apple Design System** aesthetic:
  - Background: `#1c1c1e` (dark)
  - Accent: `#0a84ff` (blue)
  - System font stack (SF Pro on macOS, Segoe UI on Windows)
  - `0.5px` hairline borders, subtle gradients
- Collapsible left sidebar with 2-column grid, search, and drag-to-canvas
- Collapsible right inspector panel for advanced node settings
- Top toolbar: Run/Stop, Save, Load, New, Execution log, Settings

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Node Graph | React Flow (@xyflow/react) |
| State Management | Zustand |
| Storage | Local JSON files (Node.js `fs`) |
| AI API | OpenRouter (proxies OpenAI, Anthropic, Google, Stability, etc.) |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Use Without an API Key

Fluxa works immediately after install. All AI nodes generate placeholder SVG images with seeded colors and simulated delays — no API key required. This is useful for testing workflows, layout, and connectivity.

### Connect Real AI Models

1. Get an API key from [OpenRouter](https://openrouter.ai/keys)
2. Click the **gear icon** (⚙) in the toolbar
3. Enter your `sk-or-v1-...` key and save
4. Run your workflow — the app will call real AI models

A green dot on the gear icon confirms the key is configured.

### Configure Model Mapping

Edit `src/lib/workflow/executor.ts` — the `MODEL_MAP` object maps node types to OpenRouter model IDs:

```ts
const MODEL_MAP: Record<string, string> = {
  "prompt-enhancer": "openai/gpt-4o",
  "gpt-4o": "openai/gpt-4o",
  claude: "anthropic/claude-3.5-sonnet",
  gemini: "google/gemini-2.0-flash-001",
  "dalle-3": "openai/dall-e-3",
  "stable-diffusion": "stabilityai/stable-diffusion-3.5-large",
  "flux-pro": "black-forest-labs/flux-1.1-pro",
};
```

Update these to whatever OpenRouter model IDs you want to use.

---

## Project Structure

```
src/
  app/
    (dashboard)/page.tsx       # Main workspace page
    layout.tsx                 # Root layout
    globals.css                # Apple dark theme, scrollbars, React Flow overrides
    api/
      workflows/               # Workflow CRUD API (JSON file storage)
        [id]/route.ts
        route.ts
      config/route.ts          # API key config API
      ai/generate/route.ts     # OpenRouter proxy endpoint
  components/
    graph/
      Canvas.tsx               # React Flow wrapper
      nodes/
        BaseNode.tsx           # Card wrapper with handles, state indicator
        PromptNode.tsx
        ImageInputNode.tsx
        VideoInputNode.tsx
        TextModelNode.tsx
        ImageModelNode.tsx
        VideoModelNode.tsx
    sidebar/
      NodePalette.tsx          # Left sidebar with drag-and-drop
    inspector/
      InspectorPanel.tsx       # Right panel for advanced settings
    toolbar/
      Toolbar.tsx              # Top toolbar: Run, Save, Load, Settings
  lib/
    nodes/
      index.ts                 # Node registry exports
      registry.ts              # Node type definitions
      serialization.ts         # Workflow ↔ JSON
    workflow/
      engine.ts                # DAG validation, topological sort, data routing
      executor.ts              # Node executors with real API + mock fallback
      run.ts                   # Run orchestrator
    ai/
      types.ts                 # Shared AI types
      openrouter.ts            # Server-side OpenRouter API client
    storage/
      file-store.ts            # Workflow JSON file I/O
      config-store.ts          # Config JSON file I/O
      paths.ts                 # data/ directory management
  store/
    workflow-store.ts          # Zustand: nodes, edges, execution state, log
    ui-store.ts                # Zustand: sidebar, inspector visibility
  types/
    workflow.ts                # WorkflowNode, WorkflowEdge, execution types
    nodes.ts                   # NodeTypeDefinition, FieldDefinition, ASPECT_RATIOS

data/
  workflows/                   # Saved workflows (*.json)
  config.json                  # API key and app config
```

---

## Workflow Execution Flow

```
[Prompt] → text → [GPT-4o] → enhanced text → [DALL·E 3] → image → (rendered in card)
```

1. **Validate** — check for cycles, orphans, invalid edges
2. **Sort** — Kahn's topological sort determines execution order
3. **Execute** — walk nodes in order:
   - Collect upstream outputs via edge connections
   - Call the node's executor (real API or mock)
   - Store output in node data
   - Update execution state (running → completed / error)
   - Log progress to the execution panel
4. **Complete** — all nodes show final state, outputs render in cards

---

## Key Decisions

- **No separate output nodes** — output renders directly inside the model card
- **Prompt Enhancer** is a single node with provider dropdown (OpenAI/Claude/Gemini) instead of separate nodes
- **Apple design aesthetic**: `#1c1c1e` background, `#0a84ff` accent, system font stack
- **Single-user, local-first**: no database, no auth, no cloud storage
- **Mock fallback**: app is fully functional without any API keys — mock executors generate placeholder SVGs
- **Server-side AI proxy**: API keys never leave the server — client calls `/api/ai/generate` which forwards to OpenRouter

---

## Build

```bash
npm run build
```

Static routes: `/`, `/dashboard`  
Dynamic API routes: `/api/workflows`, `/api/workflows/[id]`, `/api/config`, `/api/ai/generate`

---

## License

MIT

