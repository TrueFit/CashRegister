type WasmModule = {
  process_transactions: (fileContent: string, rulesConfigJson: string) => string
  validate_config: (rulesConfigJson: string) => void
  list_supported_currencies: () => string
  list_supported_strategies: () => string
}

let wasmInstance: WasmModule | null = null

export async function loadWasmModule(): Promise<WasmModule> {
  if (wasmInstance !== null) {
    return wasmInstance
  }

  const wasm = await import("../wasm-pkg/cash_register_wasm")
  wasmInstance = wasm as unknown as WasmModule
  return wasmInstance
}
