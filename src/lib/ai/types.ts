export interface AIConfig {
  openrouterApiKey: string;
}

export interface GenerateRequest {
  model: string;
  prompt: string;
  type: "text" | "image";
  temperature?: number;
  maxTokens?: number;
  aspectRatio?: string;
  width?: number;
  height?: number;
  steps?: number;
}

export interface GenerateResponse {
  success: boolean;
  type: "text" | "image" | "video";
  content: string;
  error?: string;
}
