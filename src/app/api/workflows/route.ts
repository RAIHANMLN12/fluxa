import { NextResponse } from "next/server";
import { listWorkflows, saveWorkflow } from "@/lib/storage/file-store";

export async function GET() {
  try {
    const workflows = listWorkflows();
    return NextResponse.json({ workflows });
  } catch (error) {
    return NextResponse.json({ error: "Failed to list workflows" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    saveWorkflow(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save workflow" }, { status: 500 });
  }
}
