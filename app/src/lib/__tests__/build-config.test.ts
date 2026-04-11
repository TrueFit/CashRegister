import { describe, it, expect } from "vitest"
import { buildConfigJson } from "../build-config"
import type { RulesConfig } from "../schemas"

describe("buildConfigJson", () => {
  it("serializes a simple config", () => {
    const config: RulesConfig = {
      currency: "USD",
      default_strategy: "minimal",
      rules: [],
    }
    const json = buildConfigJson(config)
    expect(JSON.parse(json)).toEqual(config)
  })

  it("serializes config with divisible_by rule", () => {
    const config: RulesConfig = {
      currency: "USD",
      default_strategy: "minimal",
      rules: [
        { condition: { type: "divisible_by", divisor: 3 }, strategy: "random" },
      ],
    }
    const json = buildConfigJson(config)
    const parsed = JSON.parse(json)
    expect(parsed.rules[0].condition.type).toBe("divisible_by")
    expect(parsed.rules[0].condition.divisor).toBe(3)
  })

  it("serializes EUR config", () => {
    const config: RulesConfig = {
      currency: "EUR",
      default_strategy: "minimal",
      rules: [],
    }
    const json = buildConfigJson(config)
    expect(JSON.parse(json).currency).toBe("EUR")
  })
})
