import { createServerFn } from "@tanstack/react-start"
import { ProcessRequestSchema, ProcessResponseSchema } from "../lib/schemas"
import type { ProcessResponse } from "../lib/schemas"
import { loadWasmModule } from "./wasm-loader"

type ProcessResult =
  | { ok: true; data: ProcessResponse }
  | { ok: false; error: string }

export const processTransactions = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ProcessRequestSchema.parse(data))
  .handler(async ({ data }): Promise<ProcessResult> => {
    try {
      const wasm = await loadWasmModule()
      const raw = wasm.process_transactions(data.fileContent, data.rulesConfigJson)
      const parsed = ProcessResponseSchema.parse(JSON.parse(raw))
      return { ok: true, data: parsed }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { ok: false, error: message }
    }
  })
