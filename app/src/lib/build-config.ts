import type { RulesConfig } from "./schemas"

export function buildConfigJson(config: RulesConfig): string {
  return JSON.stringify(config)
}
