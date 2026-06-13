import type { WorkflowNodeData } from "@/types/workflow";
import { getDimensions } from "@/types/nodes";
import type { GenerateResponse } from "@/lib/ai/types";

export type ExecutorHandler = (
  nodeData: WorkflowNodeData,
  inputs: Record<string, unknown>
) => Promise<{ type: "text" | "image" | "video"; value: string }>;

const MODEL_MAP: Record<string, string> = {
  "img-x-ai-grok-imagine-image-quality": "x-ai/grok-imagine-image-quality",
  "img-recraft-recraft-v4-1-pro-vector": "recraft/recraft-v4.1-pro-vector",
  "img-recraft-recraft-v4-1-vector": "recraft/recraft-v4.1-vector",
  "img-recraft-recraft-v4-1-utility-pro": "recraft/recraft-v4.1-utility-pro",
  "img-recraft-recraft-v4-1-utility": "recraft/recraft-v4.1-utility",
  "img-recraft-recraft-v4-1-pro": "recraft/recraft-v4.1-pro",
  "img-recraft-recraft-v4-1": "recraft/recraft-v4.1",
  "img-recraft-recraft-v4-pro-vector": "recraft/recraft-v4-pro-vector",
  "img-recraft-recraft-v4-vector": "recraft/recraft-v4-vector",
  "img-recraft-recraft-v4-pro": "recraft/recraft-v4-pro",
  "img-recraft-recraft-v4": "recraft/recraft-v4",
  "img-recraft-recraft-v3": "recraft/recraft-v3",
  "img-openai-gpt-5-4-image-2": "openai/gpt-5.4-image-2",
  "img-google-gemini-3-1-flash-image-preview": "google/gemini-3.1-flash-image-preview",
  "img-sourceful-riverflow-v2-pro": "sourceful/riverflow-v2-pro",
  "img-sourceful-riverflow-v2-fast": "sourceful/riverflow-v2-fast",
  "img-black-forest-labs-flux-2-klein-4b": "black-forest-labs/flux.2-klein-4b",
  "img-bytedance-seed-seedream-4-5": "bytedance-seed/seedream-4.5",
  "img-black-forest-labs-flux-2-max": "black-forest-labs/flux.2-max",
  "img-sourceful-riverflow-v2-max-preview": "sourceful/riverflow-v2-max-preview",
  "img-sourceful-riverflow-v2-standard-preview": "sourceful/riverflow-v2-standard-preview",
  "img-sourceful-riverflow-v2-fast-preview": "sourceful/riverflow-v2-fast-preview",
  "img-black-forest-labs-flux-2-flex": "black-forest-labs/flux.2-flex",
  "img-black-forest-labs-flux-2-pro": "black-forest-labs/flux.2-pro",
  "img-google-gemini-3-pro-image-preview": "google/gemini-3-pro-image-preview",
  "img-openai-gpt-5-image-mini": "openai/gpt-5-image-mini",
  "img-openai-gpt-5-image": "openai/gpt-5-image",
  "img-google-gemini-2-5-flash-image": "google/gemini-2.5-flash-image",
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tryApi(
  nodeData: WorkflowNodeData,
  inputs: Record<string, unknown>,
  type: "text" | "image",
  buildPrompt: () => string
): Promise<{ type: "text" | "image" | "video"; value: string } | null> {
  const model = (nodeData.fields?.model as string) || MODEL_MAP[nodeData.nodeType];
  if (!model) return null;

  const prompt = buildPrompt();

  try {
    const configRes = await fetch("/api/config");
    const config = await configRes.json();
    if (!config.openrouterApiKey) return null;

    const body: Record<string, unknown> = {
      model,
      prompt,
      type,
      temperature: nodeData.fields?.temperature ?? 0.7,
      maxTokens: nodeData.fields?.maxTokens ?? 1024,
      aspectRatio: nodeData.fields?.aspectRatio,
      steps: nodeData.fields?.steps,
    };

    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data: GenerateResponse = await res.json();
    if (!data.success) {
      if (data.error === "no_api_key") return null;
      return null;
    }

    return { type: data.type, value: data.content };
  } catch {
    return null;
  }
}

async function mockTextModel(
  nodeData: WorkflowNodeData,
  inputs: Record<string, unknown>
): Promise<{ type: "text" | "image" | "video"; value: string }> {
  const inputText = (Object.values(inputs)[0] as string) ?? (nodeData.fields?.text as string) ?? "";
  const provider = (nodeData.fields?.provider as string) ?? "openai";
  const temperature = (nodeData.fields?.temperature as number) ?? 0.7;

  await delay(800 + Math.random() * 1200);

  const enhanced =
    "[" + provider.toUpperCase() + " temp " + temperature.toFixed(1) + "]\n\n" +
    inputText + "\n\nEnhanced: " + inputText +
    ", ultra-detailed, cinematic lighting, 8K resolution, dramatic atmosphere";

  return { type: "text", value: enhanced };
}

async function mockImageModel(
  nodeData: WorkflowNodeData,
  _inputs: Record<string, unknown>
): Promise<{ type: "text" | "image" | "video"; value: string }> {
  const aspectRatio = (nodeData.fields?.aspectRatio as string) ?? "1:1";
  const seed = Math.floor(Math.random() * 1000);
  const colors = ["0a84ff", "5e5ce6", "ff375f", "ff9f0a", "30d158", "bf5af2"];

  await delay(1500 + Math.random() * 2000);

  const dims: Record<string, string> = {
    "1:1": "1024x1024",
    "16:9": "1920x1080",
    "9:16": "1080x1920",
    "4:3": "1280x960",
    "3:2": "1536x1024",
    "21:9": "2560x1080",
  };
  const [w, h] = (dims[aspectRatio] ?? "1024x1024").split("x").map(Number);
  const color = colors[seed % colors.length];

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">',
    '<rect width="' + w + '" height="' + h + '" fill="#' + color + '22"/>',
    '<rect x="' + (w * 0.1) + '" y="' + (h * 0.1) + '" width="' + (w * 0.8) + '" height="' + (h * 0.8) + '" rx="' + (Math.min(w, h) * 0.05) + '" fill="#' + color + '44" stroke="#' + color + '" stroke-width="2"/>',
    '<circle cx="' + (w * 0.5) + '" cy="' + (h * 0.4) + '" r="' + (Math.min(w, h) * 0.08) + '" fill="#' + color + '88"/>',
    '<path d="M' + (w * 0.2) + ' ' + (h * 0.7) + ' Q' + (w * 0.4) + ' ' + (h * 0.55) + ' ' + (w * 0.5) + ' ' + (h * 0.7) + ' T' + (w * 0.8) + ' ' + (h * 0.7) + '" stroke="#' + color + '" stroke-width="3" fill="none"/>',
    '<text x="' + (w * 0.5) + '" y="' + (h * 0.88) + '" text-anchor="middle" fill="#' + color + '" font-family="system-ui" font-size="' + (Math.min(w, h) * 0.04) + '">' + aspectRatio + " seed " + seed + "</text>",
    "</svg>",
  ].join("");

  return { type: "image", value: "data:image/svg+xml;base64," + btoa(svg) };
}

async function mockVideoModel(
  nodeData: WorkflowNodeData,
  _inputs: Record<string, unknown>
): Promise<{ type: "text" | "image" | "video"; value: string }> {
  const duration = (nodeData.fields?.duration as number) ?? 5;
  const aspectRatio = (nodeData.fields?.aspectRatio as string) ?? "16:9";

  await delay(2000 + Math.random() * 3000);

  const dims: Record<string, string> = {
    "1:1": "1024x1024",
    "16:9": "1920x1080",
    "9:16": "1080x1920",
    "4:3": "1280x960",
  };
  const [w, h] = (dims[aspectRatio] ?? "1920x1080").split("x").map(Number);

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">',
    '<rect width="' + w + '" height="' + h + '" fill="#1c1c1e"/>',
    '<rect x="' + (w * 0.15) + '" y="' + (h * 0.2) + '" width="' + (w * 0.7) + '" height="' + (h * 0.5) + '" rx="8" fill="#2c2c2e" stroke="#48484a" stroke-width="1"/>',
    '<polygon points="' + (w * 0.42) + "," + (h * 0.35) + " " + (w * 0.42) + "," + (h * 0.55) + " " + (w * 0.6) + "," + (h * 0.45) + '" fill="#0a84ff"/>',
    '<text x="' + (w * 0.5) + '" y="' + (h * 0.85) + '" text-anchor="middle" fill="#6c6c70" font-family="system-ui" font-size="14px">' + duration + "s " + aspectRatio + "</text>",
    "</svg>",
  ].join("");

  return { type: "video", value: "data:image/svg+xml;base64," + btoa(svg) };
}

async function mockPrompt(
  nodeData: WorkflowNodeData,
  _inputs: Record<string, unknown>
): Promise<{ type: "text" | "image" | "video"; value: string }> {
  const text = (nodeData.fields?.text as string) ?? "";
  return { type: "text", value: text };
}

async function mockFileInput(
  nodeData: WorkflowNodeData,
  _inputs: Record<string, unknown>
): Promise<{ type: "text" | "image" | "video"; value: string }> {
  const file = (nodeData.fields?.file as string) ?? "";
  return { type: (nodeData.nodeType === "image-input" ? "image" : "video") as "image" | "video", value: file };
}

async function textHandler(
  nodeData: WorkflowNodeData,
  inputs: Record<string, unknown>
): Promise<{ type: "text" | "image" | "video"; value: string }> {
  const inputText = (Object.values(inputs)[0] as string) ?? (nodeData.fields?.text as string) ?? "";
  if (!inputText) return mockTextModel(nodeData, inputs);

  const apiResult = await tryApi(nodeData, inputs, "text", () => inputText);
  if (apiResult) return apiResult;

  return mockTextModel(nodeData, inputs);
}

async function imageHandler(
  nodeData: WorkflowNodeData,
  inputs: Record<string, unknown>
): Promise<{ type: "text" | "image" | "video"; value: string }> {
  const inputText = (Object.values(inputs)[0] as string) ?? (nodeData.fields?.text as string) ?? "";

  if (inputText) {
    const apiResult = await tryApi(nodeData, inputs, "image", () => inputText);
    if (apiResult) {
      if (apiResult.value.startsWith("http")) {
        return apiResult;
      }
      return apiResult;
    }
  }

  return mockImageModel(nodeData, inputs);
}

const executorMap: Record<string, ExecutorHandler> = {
  prompt: mockPrompt,
  "image-input": mockFileInput,
  "video-input": mockFileInput,
  "prompt-enhancer": textHandler,
  "gpt-4o": textHandler,
  claude: textHandler,
  gemini: textHandler,
  "img-x-ai-grok-imagine-image-quality": imageHandler,
  "img-recraft-recraft-v4-1-pro-vector": imageHandler,
  "img-recraft-recraft-v4-1-vector": imageHandler,
  "img-recraft-recraft-v4-1-utility-pro": imageHandler,
  "img-recraft-recraft-v4-1-utility": imageHandler,
  "img-recraft-recraft-v4-1-pro": imageHandler,
  "img-recraft-recraft-v4-1": imageHandler,
  "img-recraft-recraft-v4-pro-vector": imageHandler,
  "img-recraft-recraft-v4-vector": imageHandler,
  "img-recraft-recraft-v4-pro": imageHandler,
  "img-recraft-recraft-v4": imageHandler,
  "img-recraft-recraft-v3": imageHandler,
  "img-openai-gpt-5-4-image-2": imageHandler,
  "img-google-gemini-3-1-flash-image-preview": imageHandler,
  "img-sourceful-riverflow-v2-pro": imageHandler,
  "img-sourceful-riverflow-v2-fast": imageHandler,
  "img-black-forest-labs-flux-2-klein-4b": imageHandler,
  "img-bytedance-seed-seedream-4-5": imageHandler,
  "img-black-forest-labs-flux-2-max": imageHandler,
  "img-sourceful-riverflow-v2-max-preview": imageHandler,
  "img-sourceful-riverflow-v2-standard-preview": imageHandler,
  "img-sourceful-riverflow-v2-fast-preview": imageHandler,
  "img-black-forest-labs-flux-2-flex": imageHandler,
  "img-black-forest-labs-flux-2-pro": imageHandler,
  "img-google-gemini-3-pro-image-preview": imageHandler,
  "img-openai-gpt-5-image-mini": imageHandler,
  "img-openai-gpt-5-image": imageHandler,
  "img-google-gemini-2-5-flash-image": imageHandler,
  "vid-x-ai-grok-imagine-video": mockVideoModel,
  "vid-kwaivgi-kling-v3-0-pro": mockVideoModel,
  "vid-kwaivgi-kling-v3-0-std": mockVideoModel,
  "vid-google-veo-3-1-fast": mockVideoModel,
  "vid-google-veo-3-1-lite": mockVideoModel,
  "vid-kwaivgi-kling-video-o1": mockVideoModel,
  "vid-minimax-hailuo-2-3": mockVideoModel,
  "vid-bytedance-seedance-2-0-fast": mockVideoModel,
  "vid-alibaba-wan-2-7": mockVideoModel,
  "vid-bytedance-seedance-2-0": mockVideoModel,
  "vid-alibaba-wan-2-6": mockVideoModel,
  "vid-bytedance-seedance-1-5-pro": mockVideoModel,
  "vid-google-veo-3-1": mockVideoModel,
};

export function getExecutor(nodeType: string): ExecutorHandler | null {
  return executorMap[nodeType] ?? null;
}

export { mockTextModel, mockImageModel, mockVideoModel };



