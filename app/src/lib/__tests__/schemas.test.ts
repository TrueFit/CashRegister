import { describe, it, expect } from "vitest"
import {
  ProcessRequestSchema,
  ProcessResponseSchema,
  RulesConfigSchema,
  ConditionSchema,
} from "../schemas"

describe("ProcessRequestSchema", () => {
  it("accepts valid request", () => {
    const result = ProcessRequestSchema.parse({
      fileContent: "2.12,3.00",
      rulesConfigJson: "{}",
    })
    expect(result.fileContent).toBe("2.12,3.00")
    expect(result.rulesConfigJson).toBe("{}")
  })

  it("rejects empty fileContent", () => {
    expect(() =>
      ProcessRequestSchema.parse({ fileContent: "", rulesConfigJson: "{}" }),
    ).toThrow()
  })

  it("rejects empty rulesConfigJson", () => {
    expect(() =>
      ProcessRequestSchema.parse({ fileContent: "x", rulesConfigJson: "" }),
    ).toThrow()
  })

  it("rejects missing fields", () => {
    expect(() => ProcessRequestSchema.parse({ fileContent: "x" })).toThrow()
  })
})

describe("ProcessResponseSchema", () => {
  it("parses successful response", () => {
    const raw = {
      success: true,
      results: [
        {
          line: 1,
          input: "2.12,3.00",
          output: "3 quarters,1 dime,3 pennies",
          strategy: "minimal",
          error: null,
        },
      ],
      total_lines: 1,
      error_count: 0,
    }
    const result = ProcessResponseSchema.parse(raw)
    expect(result.results).toHaveLength(1)
    expect(result.results[0].strategy).toBe("minimal")
    expect(result.results[0].error).toBeNull()
  })

  it("parses response with errors", () => {
    const raw = {
      success: false,
      results: [
        {
          line: 1,
          input: "bad line",
          output: null,
          strategy: null,
          error: "Parse error",
        },
      ],
      total_lines: 1,
      error_count: 1,
    }
    const result = ProcessResponseSchema.parse(raw)
    expect(result.results[0].error).toBe("Parse error")
    expect(result.results[0].output).toBeNull()
  })
})

describe("RulesConfigSchema", () => {
  it("parses full config", () => {
    const result = RulesConfigSchema.parse({
      currency: "USD",
      default_strategy: "minimal",
      rules: [
        { condition: { type: "divisible_by", divisor: 3 }, strategy: "random" },
      ],
    })
    expect(result.currency).toBe("USD")
    expect(result.rules).toHaveLength(1)
  })

  it("accepts empty rules array", () => {
    const result = RulesConfigSchema.parse({
      currency: "EUR",
      default_strategy: "minimal",
      rules: [],
    })
    expect(result.rules).toHaveLength(0)
  })
})

describe("ConditionSchema", () => {
  it("parses divisible_by condition", () => {
    const result = ConditionSchema.parse({ type: "divisible_by", divisor: 3 })
    expect(result).toEqual({ type: "divisible_by", divisor: 3 })
  })

  it("parses amount_range condition", () => {
    const result = ConditionSchema.parse({
      type: "amount_range",
      min_cents: 100,
      max_cents: 500,
    })
    expect(result.type).toBe("amount_range")
  })

  it("parses always condition", () => {
    const result = ConditionSchema.parse({ type: "always" })
    expect(result.type).toBe("always")
  })

  it("rejects unknown type", () => {
    expect(() => ConditionSchema.parse({ type: "bogus" })).toThrow()
  })

  it("rejects divisible_by with divisor < 1", () => {
    expect(() =>
      ConditionSchema.parse({ type: "divisible_by", divisor: 0 }),
    ).toThrow()
  })
})
