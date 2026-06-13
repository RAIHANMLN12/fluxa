# Fluxa — Implementation Plan

Fluxa is a node-based multimodal AI workflow platform that allows users to create, organize, and execute creative pipelines using modern generative AI models through an interactive visual interface.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Node Graph** | React Flow (xyflow) |
| **State Mgmt** | Zustand (workflow state) + TanStack Query (server state) |
| **Storage** | Local JSON files (`data/workflows/`, `data/outputs/`) |
| **Auth** | None (single-user, local-first) |
| **AI APIs** | OpenAI, Stability AI, Replicate, Anthropic |
| **Deployment** | `npm run dev` — zero setup |

---

## UI Layout

```
┌──────────────┬──────────────────────────────────────┬─────────────────┐
│  LEFT        │          WORKSPACE                   │  RIGHT          │
│  SIDEBAR     │          (Canvas)                    │  INSPECTOR      │
│  (Nodes)     │                                      │  (Properties)   │
│              │                                      │                  │
│  ── INPUTS ──│    ┌────────────┐                    │  Selected Node  │
│   Prompt     │    │ Prompt     │                    │  Settings       │
│   Image      │    │ ───────────│                    │  ─────────────  │
│   Video      │    │ "a cat..." │                    │  Width: [1024]  │
│              │    │ ○ output   │                    │  Height: [1024] │
│  ── TEXT ────│    └─────┬──────┘                    │  Steps:  [30]   │
│   GPT-4o     │          │                           │  Aspect: [1:1]  │
│   Claude     │          ▼                           │  ...            │
│   Gemini     │    ┌────────────┐                    │                  │
│              │    │ GPT-4o     │                    │                  │
│  ── IMAGE ───│    │ ───────────│                    │                  │
│   DALL·E 3   │    │ Temp: 0.7  │                    │                  │
│   SD3        │    │ ○ input    │                    │                  │
│   Flux Pro   │    │ ○ output   │                    │                  │
│              │    └──┬─────┬───┘                    │                  │
│  ── VIDEO ───│       │     │                        │                  │
│   Runway     │       │     ▼                        │                  │
│   Pika       │       │  ┌────────────┐              │                  │
│   Kling      │       │  │ DALL·E 3   │              │                  │
│              │       │  │ ───────────│              │                  │
│              │       └─►│ Prompt src │              │                  │
│              │          │ Width:1024 │              │                  │
│              │          │ ○ input    │              │                  │
│              │          │ ○ output───┼──┐           │                  │
│              │          └────────────┘  │           │                  │
│              │                          ▼           │                  │
│              │                     ┌────────────┐   │                  │
│              │                     │ OUTPUT     │   │                  │
│              │                     │ ───────────│   │                  │
│              │                     │ [Image]    │   │                  │
│              │                     │ ○ input    │   │                  │
│              │                     └────────────┘   │                  │
└──────────────┴──────────────────────────────────────┴──────────────────┘
└─────────────────────── TOP TOOLBAR ─────────────────────────────────────┘
    [Run ▶] [Stop ■] [Save] [Load] [Undo] [Redo] [Auto-Layout]
```

---

## Node Architecture

Every node is a **card** rendered directly on the canvas with its own form fields.

### Node Types

#### Input Nodes (output port only — right side)

| Node | Description | Fields in Card |
|------|-------------|----------------|
| **Prompt** | Text input | `<textarea>` for prompt text |
| **Image** | Image upload | File picker / drag-drop zone |
| **Video** | Video upload | File picker / drag-drop zone |

#### Model Nodes (input port left + output port right)

| Node | Description | Fields in Card | Fields in Inspector |
|------|-------------|----------------|---------------------|
| **GPT-4o** | Text generation | Temperature | System prompt, max tokens, top p |
| **Claude 3.5** | Text generation | Temperature | System prompt, max tokens |
| **Gemini 2.5** | Text generation | Temperature | System prompt, max tokens |
| **DALL·E 3** | Image generation | Width, Height, Aspect Ratio | Quality, Style, negative prompt |
| **Stable Diffusion 3** | Image generation | Width, Height | Steps, CFG scale, negative prompt |
| **Flux Pro** | Image generation | Width, Height | Steps, prompt strength |
| **Runway Gen-3** | Video generation | Duration, resolution | Motion, camera settings |
| **Pika 2.0** | Video generation | Duration, resolution | Motion, guidance |
| **Kling 1.6** | Video generation | Duration, resolution | Motion, negative prompt |

#### Output Nodes (input port only — left side)

| Node | Description | Display |
|------|-------------|---------|
| **Text Output** | Shows generated text | Rendered text area |
| **Image Output** | Shows generated image | Image preview |
| **Video Output** | Shows generated video | Video player |

---

## Data Flow (Execution)

```
[Prompt] ──text──► [GPT-4o] ──text──► [DALL·E 3] ──image──► [Output]
                    │                                            │
                    │  input: { prompt: "cat" }                  │
                    │  output: { text: "..." }                   │
                    │                                            │
                    └────────────► DALL·E 3 receives ────────────┘
                                  { prompt: "..." }
                                  + width, height from its own fields
```

Execution direction: **left to right**. The engine topologically sorts the graph, then walks nodes in order, passing outputs as inputs to downstream nodes.

---

## Phases

### Phase 1: Foundation

- [ ] Next.js project init with TypeScript, Tailwind, ESLint
- [ ] React Flow + shadcn/ui setup
- [ ] Folder structure scaffold
- [ ] Core node system: type registry, port definitions, serialization
- [ ] JSON file storage layer (workflows saved as `.json`)
- [ ] Basic UI shell: sidebar, canvas, inspector
- [ ] Drag nodes from sidebar → drop onto canvas
- [ ] Node cards with inline form fields
- [ ] Edge connections (port to port)
- [ ] Workflow save / load (JSON files)

### Phase 2: Workflow Engine

- [ ] Graph validation (cycle detection, orphan nodes)
- [ ] Topological sort for execution order
- [ ] Node executor: each node type defines `execute(inputs) => outputs`
- [ ] Edge-based data routing (pass outputs → inputs)
- [ ] Execution state machine: `idle → running → completed/error`
- [ ] Run / Stop controls in toolbar
- [ ] Real-time execution feedback per node (loading spinner, result preview)
- [ ] Input nodes (Prompt, Image, Video — file picker)
- [ ] Output nodes (Text, Image, Video display)

### Phase 3: AI Model Integration

- [ ] AI Adapter interface:
  ```ts
  interface AIModelAdapter {
    execute(params: ModelParams): Promise<ModelOutput>;
    validateConfig(config: ProviderConfig): ValidationResult;
  }
  ```
- [ ] OpenAI adapter — GPT-4o, DALL·E 3
- [ ] Anthropic adapter — Claude 3.5
- [ ] Google adapter — Gemini 2.5
- [ ] Stability AI adapter — Stable Diffusion 3
- [ ] Replicate adapter — Flux Pro + community models
- [ ] Video model adapters — Runway, Pika, Kling
- [ ] API key management (stored locally in JSON config)
- [ ] Rate limiting & retry logic
- [ ] Streaming output display (token-by-token text, progressive image)
- [ ] Error handling per provider

### Phase 4: Advanced Features

- [ ] Conditional branching (if/else nodes)
- [ ] Batch processing (array inputs)
- [ ] Node grouping / sub-workflows
- [ ] Workflow templates (pre-built for common tasks)
- [ ] Output gallery (local file browser for generated assets)
- [ ] Workflow versioning / fork
- [ ] Undo/redo
- [ ] Auto-layout
- [ ] Keyboard shortcuts

### Phase 5: Polish & Extensions

- [ ] Dark/light theme
- [ ] CI/CD (GitHub Actions — lint, typecheck, build)
- [ ] E2E tests (Playwright)
- [ ] Performance — large workflow optimization
- [ ] Plugin system for community node types
- [ ] Docker image for easy self-host
- [ ] Landing page & docs

---

## Folder Structure

```
src/
  app/                    # Next.js App Router
    (dashboard)/
      page.tsx            # Main workspace page
    api/
      workflows/          # Workflow CRUD API (JSON file based)
        [id]/
          execute/route.ts
  components/
    graph/
      Canvas.tsx          # React Flow wrapper
      nodes/              # Custom node renderers
        BaseNode.tsx
        PromptNode.tsx
        ImageNode.tsx
        VideoNode.tsx
        TextModelNode.tsx
        ImageModelNode.tsx
        VideoModelNode.tsx
        OutputNode.tsx
      edges/              # Custom edge renderers
    sidebar/
      NodePalette.tsx     # Left sidebar with draggable nodes
    inspector/
      InspectorPanel.tsx  # Right panel — dynamic form per node
      fields/             # Form field components
        TextField.tsx
        SelectField.tsx
        SliderField.tsx
        FilePicker.tsx
    toolbar/
      Toolbar.tsx         # Top bar with Run/Stop/Save/etc
  lib/
    nodes/
      registry.ts         # Node type registry
      types.ts            # Node/port type definitions
      serialization.ts    # Workflow ↔ JSON
    workflow/
      engine.ts           # DAG validation + topological sort + execution
      executor.ts         # Runs nodes in order, routes data
    ai/
      adapters/           # Per-provider adapters
        openai.ts
        anthropic.ts
        google.ts
        stability.ts
        replicate.ts
        runway.ts
        pika.ts
        kling.ts
      types.ts            # Unified AI model interfaces
    storage/
      file-store.ts       # JSON file read/write
      paths.ts            # data/ directory management
  store/
    workflow-store.ts     # Zustand: nodes, edges, execution state
    ui-store.ts           # Zustand: selected node, sidebar state
  types/
    workflow.ts
    nodes.ts
    ai.ts
data/                     # Local storage (gitignored except sample)
  workflows/              # Saved workflow JSON files
  outputs/                # Generated images/videos
  config.json             # API keys and app settings
```
