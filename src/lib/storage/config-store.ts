import fs from "fs";
import type { AIConfig } from "@/lib/ai/types";
import { getConfigPath } from "./paths";

const defaultConfig: AIConfig = {
  openrouterApiKey: "",
};

export function loadConfig(): AIConfig {
  const configPath = getConfigPath();
  try {
    if (!fs.existsSync(configPath)) {
      saveConfig(defaultConfig);
      return defaultConfig;
    }
    const raw = fs.readFileSync(configPath, "utf8");
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch {
    return defaultConfig;
  }
}

export function saveConfig(config: AIConfig): void {
  const configPath = getConfigPath();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
}

export function hasApiKey(): boolean {
  const config = loadConfig();
  return config.openrouterApiKey.length > 0;
}
