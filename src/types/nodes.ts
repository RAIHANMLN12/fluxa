export type NodeCategory = "input" | "image-model" | "video-model";

export type PortDirection = "input" | "output";

export interface PortDefinition {
  id: string;
  label: string;
  direction: PortDirection;
  type: "text" | "image" | "video" | "any";
}

export interface FieldDefinition {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "slider" | "file" | "image" | "video";
  default?: unknown;
  options?: { label: string; value: string | number }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface NodeTypeDefinition {
  type: string;
  label: string;
  category: NodeCategory;
  color: string;
  icon: string;
  ports: PortDefinition[];
  fields: FieldDefinition[];
  inspectorFields?: FieldDefinition[];
  defaultWidth?: number;
  defaultHeight?: number;
}

export const ASPECT_RATIOS = [
  { label: "Square (1:1)", value: "1:1" },
  { label: "Landscape (16:9)", value: "16:9" },
  { label: "Portrait (9:16)", value: "9:16" },
  { label: "Standard (4:3)", value: "4:3" },
  { label: "Photo (3:2)", value: "3:2" },
  { label: "Ultrawide (21:9)", value: "21:9" },
] as const;

export function getDimensions(aspectRatio: string, modelType: string): { width: number; height: number } {
  if (modelType === "dalle-3") {
    switch (aspectRatio) {
      case "1:1": return { width: 1024, height: 1024 };
      case "16:9": return { width: 1792, height: 1024 };
      case "9:16": return { width: 1024, height: 1792 };
      default: return { width: 1024, height: 1024 };
    }
  }
  switch (aspectRatio) {
    case "1:1": return { width: 1024, height: 1024 };
    case "16:9": return { width: 1920, height: 1080 };
    case "9:16": return { width: 1080, height: 1920 };
    case "4:3": return { width: 1280, height: 960 };
    case "3:2": return { width: 1536, height: 1024 };
    case "21:9": return { width: 2560, height: 1080 };
    default: return { width: 1024, height: 1024 };
  }
}

export const NODE_DEFINITIONS: NodeTypeDefinition[] = [
  {
    type: "prompt",
    label: "Prompt",
    category: "input",
    color: "#8b5cf6",
    icon: "Text",
    ports: [
      { id: "output", label: "Output", direction: "output", type: "text" },
    ],
    fields: [
      { name: "text", label: "Prompt", type: "textarea", default: "", placeholder: "Enter your prompt..." },
    ],
  },
  {
    type: "image-input",
    label: "Image",
    category: "input",
    color: "#ec4899",
    icon: "Image",
    ports: [
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "file", label: "Image", type: "image", default: null },
    ],
  },
  {
    type: "video-input",
    label: "Video",
    category: "input",
    color: "#f59e0b",
    icon: "Video",
    ports: [
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "file", label: "Video", type: "video", default: null },
    ],
  },
  {
    type: "prompt-enhancer",
    label: "Prompt Enhancer",
    category: "input",
    color: "#10b981",
    icon: "Wand",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "text" },
    ],
    fields: [
      { name: "provider", label: "Provider", type: "select", default: "openai", options: [{ label: "OpenAI (GPT-4o)", value: "openai" }, { label: "Anthropic (Claude)", value: "claude" }, { label: "Google (Gemini)", value: "gemini" }] },
    ],
    inspectorFields: [
      { name: "systemPrompt", label: "Enhancer Style", type: "textarea", default: "You are a prompt engineering expert. Enhance the given prompt to be more detailed, descriptive, and optimized for AI image/video generation. Expand on style, lighting, composition, mood, and atmosphere. Respond only with the enhanced prompt.", placeholder: "Custom system prompt..." },
      { name: "temperature", label: "Temperature", type: "slider", default: 0.7, min: 0, max: 2, step: 0.1 },
      { name: "maxTokens", label: "Max Tokens", type: "number", default: 512, min: 64, max: 4096 },
    ],
  },
  {
    type: "img-x-ai-grok-imagine-image-quality",
    label: "xAI - Grok Imagine",
    category: "image-model",
    color: "#f97316",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-recraft-recraft-v4-1-pro-vector",
    label: "Recraft - V4.1 Pro Vector",
    category: "image-model",
    color: "#14b8a6",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-recraft-recraft-v4-1-vector",
    label: "Recraft - V4.1 Vector",
    category: "image-model",
    color: "#a855f7",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-recraft-recraft-v4-1-utility-pro",
    label: "Recraft - V4.1 Utility Pro",
    category: "image-model",
    color: "#06b6d4",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-recraft-recraft-v4-1-utility",
    label: "Recraft - V4.1 Utility",
    category: "image-model",
    color: "#e11d48",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-recraft-recraft-v4-1-pro",
    label: "Recraft - V4.1 Pro",
    category: "image-model",
    color: "#7c3aed",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-recraft-recraft-v4-1",
    label: "Recraft - V4.1",
    category: "image-model",
    color: "#0a84ff",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-recraft-recraft-v4-pro-vector",
    label: "Recraft - V4 Pro Vector",
    category: "image-model",
    color: "#5e5ce6",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-recraft-recraft-v4-vector",
    label: "Recraft - V4 Vector",
    category: "image-model",
    color: "#ff375f",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-recraft-recraft-v4-pro",
    label: "Recraft - V4 Pro",
    category: "image-model",
    color: "#ff9f0a",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-recraft-recraft-v4",
    label: "Recraft - V4",
    category: "image-model",
    color: "#30d158",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-recraft-recraft-v3",
    label: "Recraft - V3",
    category: "image-model",
    color: "#bf5af2",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-openai-gpt-5-4-image-2",
    label: "OpenAI - GPT-5.4 Image 2",
    category: "image-model",
    color: "#ff6482",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-google-gemini-3-1-flash-image-preview",
    label: "Google - Gemini 3.1 Flash Image",
    category: "image-model",
    color: "#64d2ff",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-sourceful-riverflow-v2-pro",
    label: "Sourceful - Riverflow V2 Pro",
    category: "image-model",
    color: "#ffd60a",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-sourceful-riverflow-v2-fast",
    label: "Sourceful - Riverflow V2 Fast",
    category: "image-model",
    color: "#30d158",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-black-forest-labs-flux-2-klein-4b",
    label: "BFL - FLUX.2 Klein 4B",
    category: "image-model",
    color: "#5e5ce6",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-bytedance-seed-seedream-4-5",
    label: "ByteDance - Seedream 4.5",
    category: "image-model",
    color: "#ff9f0a",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-black-forest-labs-flux-2-max",
    label: "BFL - FLUX.2 Max",
    category: "image-model",
    color: "#ff375f",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-sourceful-riverflow-v2-max-preview",
    label: "Sourceful - Riverflow V2 Max Preview",
    category: "image-model",
    color: "#64d2ff",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-sourceful-riverflow-v2-standard-preview",
    label: "Sourceful - Riverflow V2 Std Preview",
    category: "image-model",
    color: "#0a84ff",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-sourceful-riverflow-v2-fast-preview",
    label: "Sourceful - Riverflow V2 Fast Preview",
    category: "image-model",
    color: "#bf5af2",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-black-forest-labs-flux-2-flex",
    label: "BFL - FLUX.2 Flex",
    category: "image-model",
    color: "#30d158",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-black-forest-labs-flux-2-pro",
    label: "BFL - FLUX.2 Pro",
    category: "image-model",
    color: "#ff6482",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-google-gemini-3-pro-image-preview",
    label: "Google - Gemini 3 Pro Image",
    category: "image-model",
    color: "#5e5ce6",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-openai-gpt-5-image-mini",
    label: "OpenAI - GPT-5 Image Mini",
    category: "image-model",
    color: "#ffd60a",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-openai-gpt-5-image",
    label: "OpenAI - GPT-5 Image",
    category: "image-model",
    color: "#ff9f0a",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "img-google-gemini-2-5-flash-image",
    label: "Google - Gemini 2.5 Flash Image",
    category: "image-model",
    color: "#bf5af2",
    icon: "Image",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "image" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "1:1", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
    ],
    inspectorFields: [
      { name: "steps", label: "Steps", type: "number", default: 25, min: 1, max: 150 },
    ],
  },
  {
    type: "vid-x-ai-grok-imagine-video",
    label: "xAI - Grok Imagine Video",
    category: "video-model",
    color: "#06b6d4",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-kwaivgi-kling-v3-0-pro",
    label: "Kling - Video v3.0 Pro",
    category: "video-model",
    color: "#e11d48",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-kwaivgi-kling-v3-0-std",
    label: "Kling - Video v3.0 Standard",
    category: "video-model",
    color: "#7c3aed",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-google-veo-3-1-fast",
    label: "Google - Veo 3.1 Fast",
    category: "video-model",
    color: "#0a84ff",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-google-veo-3-1-lite",
    label: "Google - Veo 3.1 Lite",
    category: "video-model",
    color: "#5e5ce6",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-kwaivgi-kling-video-o1",
    label: "Kling - Video O1",
    category: "video-model",
    color: "#ff375f",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-minimax-hailuo-2-3",
    label: "MiniMax - Hailuo 2.3",
    category: "video-model",
    color: "#ff9f0a",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-bytedance-seedance-2-0-fast",
    label: "ByteDance - Seedance 2.0 Fast",
    category: "video-model",
    color: "#30d158",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-alibaba-wan-2-7",
    label: "Alibaba - Wan 2.7",
    category: "video-model",
    color: "#bf5af2",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-bytedance-seedance-2-0",
    label: "ByteDance - Seedance 2.0",
    category: "video-model",
    color: "#ff6482",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-alibaba-wan-2-6",
    label: "Alibaba - Wan 2.6",
    category: "video-model",
    color: "#64d2ff",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-bytedance-seedance-1-5-pro",
    label: "ByteDance - Seedance 1.5 Pro",
    category: "video-model",
    color: "#ffd60a",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    type: "vid-google-veo-3-1",
    label: "Google - Veo 3.1",
    category: "video-model",
    color: "#30d158",
    icon: "Video",
    ports: [
      { id: "input", label: "Input", direction: "input", type: "text" },
      { id: "output", label: "Output", direction: "output", type: "video" },
    ],
    fields: [
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", default: "16:9", options: ASPECT_RATIOS.map((r) => ({ label: r.label, value: r.value })) },
      { name: "duration", label: "Duration (s)", type: "number", default: 5, min: 1, max: 30 },
    ],
    inspectorFields: [
      { name: "motion", label: "Motion Strength", type: "slider", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
];





