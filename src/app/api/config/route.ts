import { NextResponse } from "next/server";
import { loadConfig, saveConfig } from "@/lib/storage/config-store";

export async function GET() {
  const config = loadConfig();
  return NextResponse.json({ openrouterApiKey: config.openrouterApiKey ? "configured" : "" });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const config = loadConfig();

    if (body.openrouterApiKey !== undefined) {
      config.openrouterApiKey = body.openrouterApiKey;
    }

    saveConfig(config);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
