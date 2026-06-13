import { NextResponse } from "next/server";
import { loadConfig } from "@/lib/storage/config-store";
import { generateChat, generateImage } from "@/lib/ai/openrouter";
import type { GenerateRequest, GenerateResponse } from "@/lib/ai/types";

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();
    const config = loadConfig();

    if (!config.openrouterApiKey) {
      return NextResponse.json(
        { success: false, type: body.type, content: "", error: "no_api_key" } satisfies GenerateResponse,
        { status: 403 }
      );
    }

    let content: string;

    switch (body.type) {
      case "text": {
        content = await generateChat(
          config.openrouterApiKey,
          body.model,
          body.prompt,
          { temperature: body.temperature, maxTokens: body.maxTokens }
        );
        break;
      }
      case "image": {
        content = await generateImage(
          config.openrouterApiKey,
          body.model,
          body.prompt,
          { aspectRatio: body.aspectRatio, steps: body.steps }
        );
        break;
      }
      default: {
        return NextResponse.json(
          { success: false, type: "text", content: "", error: "unsupported_type" } satisfies GenerateResponse,
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      type: body.type,
      content,
    } satisfies GenerateResponse);
  } catch (err) {
    return NextResponse.json(
      { success: false, type: "text", content: "", error: String(err) } satisfies GenerateResponse,
      { status: 500 }
    );
  }
}
