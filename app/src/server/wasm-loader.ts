import {
  process_transactions,
  validate_config,
  list_supported_currencies,
  list_supported_strategies,
} from "../wasm-pkg/cash_register_wasm"
import type { WasmModule } from "./wasm-types"

export type { WasmModule }

export function loadWasmModule(): WasmModule {
  return {
    process_transactions,
    validate_config,
    list_supported_currencies,
    list_supported_strategies,
  }
}
