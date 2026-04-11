export type WasmModule = {
  process_transactions: (fileContent: string, rulesConfigJson: string) => string
  validate_config: (rulesConfigJson: string) => void
  list_supported_currencies: () => string
  list_supported_strategies: () => string
}
