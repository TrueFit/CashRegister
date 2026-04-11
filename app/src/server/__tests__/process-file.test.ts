import { describe, it, expect, vi } from "vitest"

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    inputValidator: () => ({ handler: () => () => null }),
  }),
}))

vi.mock("../wasm-loader", () => ({
  loadWasmModule: vi.fn(),
}))

import { processWithWasm } from "../process-file"
import type { WasmModule } from "../wasm-types"

function makeWasmMock(overrides: Partial<WasmModule> = {}): WasmModule {
  return {
    process_transactions: vi.fn(() =>
      JSON.stringify({
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
      }),
    ),
    validate_config: vi.fn(),
    list_supported_currencies: vi.fn(() => JSON.stringify(["USD", "EUR"])),
    list_supported_strategies: vi.fn(() => JSON.stringify(["minimal", "random"])),
    ...overrides,
  }
}

describe("processWithWasm", () => {
  it("returns ok with parsed response on success", async () => {
    const wasm = makeWasmMock()
    const result = await processWithWasm(wasm, {
      fileContent: "2.12,3.00",
      rulesConfigJson: '{"currency":"USD","default_strategy":"minimal","rules":[]}',
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.results).toHaveLength(1)
      expect(result.data.results[0].output).toBe("3 quarters,1 dime,3 pennies")
      expect(result.data.total_lines).toBe(1)
    }
  })

  it("passes fileContent and rulesConfigJson to wasm.process_transactions", async () => {
    const processSpy = vi.fn(() =>
      JSON.stringify({
        success: true,
        results: [],
        total_lines: 0,
        error_count: 0,
      }),
    )
    const wasm = makeWasmMock({ process_transactions: processSpy })

    await processWithWasm(wasm, {
      fileContent: "file content here",
      rulesConfigJson: '{"currency":"EUR"}',
    })

    expect(processSpy).toHaveBeenCalledWith(
      "file content here",
      '{"currency":"EUR"}',
    )
  })

  it("returns ok:false when wasm throws", async () => {
    const wasm = makeWasmMock({
      process_transactions: vi.fn(() => {
        throw new Error("WASM crashed")
      }),
    })

    const result = await processWithWasm(wasm, {
      fileContent: "x",
      rulesConfigJson: "{}",
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe("WASM crashed")
    }
  })

  it("returns ok:false when wasm returns invalid JSON", async () => {
    const wasm = makeWasmMock({
      process_transactions: vi.fn(() => "not json"),
    })

    const result = await processWithWasm(wasm, {
      fileContent: "x",
      rulesConfigJson: "{}",
    })

    expect(result.ok).toBe(false)
  })

  it("returns ok:false when wasm returns response missing required fields", async () => {
    const wasm = makeWasmMock({
      process_transactions: vi.fn(() => JSON.stringify({ success: true })),
    })

    const result = await processWithWasm(wasm, {
      fileContent: "x",
      rulesConfigJson: "{}",
    })

    expect(result.ok).toBe(false)
  })

  it("handles response with errors", async () => {
    const wasm = makeWasmMock({
      process_transactions: vi.fn(() =>
        JSON.stringify({
          success: false,
          results: [
            {
              line: 1,
              input: "bad",
              output: null,
              strategy: null,
              error: "Parse error",
            },
          ],
          total_lines: 1,
          error_count: 1,
        }),
      ),
    })

    const result = await processWithWasm(wasm, {
      fileContent: "bad",
      rulesConfigJson: "{}",
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.error_count).toBe(1)
      expect(result.data.results[0].error).toBe("Parse error")
    }
  })
})
