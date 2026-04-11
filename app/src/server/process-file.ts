import { createServerFn } from "@tanstack/react-start"
import { ProcessRequestSchema, ProcessResponseSchema } from "../lib/schemas"
import type { ProcessRequest, ProcessResponse } from "../lib/schemas"
import { loadWasmModule } from "./wasm-loader"
import type { WasmModule } from "./wasm-types"

export type ProcessResult =
  | { ok: true; data: ProcessResponse }
  | { ok: false; error: string }

export async function processWithWasm(
  wasm: WasmModule,
  data: ProcessRequest,
): Promise<ProcessResult> {
  try {
    const raw = wasm.process_transactions(data.fileContent, data.rulesConfigJson)
    const parsed = ProcessResponseSchema.parse(JSON.parse(raw))
    return { ok: true, data: parsed }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}

export const processTransactions = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ProcessRequestSchema.parse(data))
  .handler(async ({ data }): Promise<ProcessResult> => {
    const wasm = loadWasmModule()
    return processWithWasm(wasm, data)
  })
