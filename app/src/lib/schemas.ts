import { z } from "zod"

export const ProcessRequestSchema = z.object({
  fileContent: z.string().min(1),
  rulesConfigJson: z.string().min(1),
})

export type ProcessRequest = z.infer<typeof ProcessRequestSchema>

const LineResultSchema = z.object({
  line: z.number(),
  input: z.string(),
  output: z.string().nullable(),
  strategy: z.string().nullable(),
  error: z.string().nullable(),
})

export const ProcessResponseSchema = z.object({
  success: z.boolean(),
  results: z.array(LineResultSchema),
  total_lines: z.number(),
  error_count: z.number(),
})

export type ProcessResponse = z.infer<typeof ProcessResponseSchema>
export type LineResult = z.infer<typeof LineResultSchema>

export const ConditionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("divisible_by"), divisor: z.number().int().min(1) }),
  z.object({
    type: z.literal("amount_range"),
    min_cents: z.number().int().optional(),
    max_cents: z.number().int().optional(),
  }),
  z.object({ type: z.literal("always") }),
])

export type Condition = z.infer<typeof ConditionSchema>

export const RuleSchema = z.object({
  condition: ConditionSchema,
  strategy: z.string(),
})

export type Rule = z.infer<typeof RuleSchema>

export const RulesConfigSchema = z.object({
  currency: z.string(),
  default_strategy: z.string(),
  rules: z.array(RuleSchema),
})

export type RulesConfig = z.infer<typeof RulesConfigSchema>
