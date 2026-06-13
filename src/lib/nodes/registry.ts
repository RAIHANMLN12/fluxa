import { NODE_DEFINITIONS, type NodeTypeDefinition } from "@/types/nodes";

class NodeRegistry {
  private definitions = new Map<string, NodeTypeDefinition>();

  constructor() {
    for (const def of NODE_DEFINITIONS) {
      this.definitions.set(def.type, def);
    }
  }

  get(type: string): NodeTypeDefinition | undefined {
    return this.definitions.get(type);
  }

  getAll(): NodeTypeDefinition[] {
    return Array.from(this.definitions.values());
  }

  getByCategory(category: string): NodeTypeDefinition[] {
    return this.getAll().filter((d) => d.category === category);
  }
}

export const nodeRegistry = new NodeRegistry();
