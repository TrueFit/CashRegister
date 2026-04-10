import {
  process_transactions,
  validate_config,
  list_supported_currencies,
  list_supported_strategies,
} from "../wasm-pkg/cash_register_wasm"

export type WasmModule = {
  process_transactions: (fileContent: string, rulesConfigJson: string) => string
  validate_config: (rulesConfigJson: string) => void
  list_supported_currencies: () => string
  list_supported_strategies: () => string
}

export function loadWasmModule(): WasmModule {
  return {
    process_transactions,
    validate_config,
    list_supported_currencies,
    list_supported_strategies,
  }
}
