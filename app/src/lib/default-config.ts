import type { RulesConfig } from "./schemas"

export const DEFAULT_RULES_CONFIG: RulesConfig = {
  currency: "USD",
  default_strategy: "minimal",
  rules: [
    {
      condition: { type: "divisible_by", divisor: 3 },
      strategy: "random",
    },
  ],
}
