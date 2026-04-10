import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { FileUpload } from "../components/FileUpload"
import { RulesBuilder } from "../components/RulesBuilder"
import { ResultsTable } from "../components/ResultsTable"
import { ResultsTableSkeleton } from "../components/ResultsTable.skeleton"
import { ErrorBanner } from "../components/ErrorBanner"
import { DEFAULT_RULES_CONFIG } from "../lib/default-config"
import { buildConfigJson } from "../lib/build-config"
import { processTransactions } from "../server/process-file"
import type { ProcessResponse, RulesConfig } from "../lib/schemas"
import "../styles/app.css"

export const Route = createFileRoute("/")({
  component: IndexPage,
})

const SUPPORTED_CURRENCIES = ["USD", "EUR"]
const SUPPORTED_STRATEGIES = ["minimal", "random"]

function IndexPage() {
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [config, setConfig] = useState<RulesConfig>(DEFAULT_RULES_CONFIG)
  const [result, setResult] = useState<ProcessResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcess = async () => {
    if (!fileContent) {
      return
    }

    setIsProcessing(true)
    setError(null)
    setResult(null)

    const response = await processTransactions({
      data: {
        fileContent,
        rulesConfigJson: buildConfigJson(config),
      },
    })

    setIsProcessing(false)

    if (!response.ok) {
      setError(response.error)
      return
    }

    setResult(response.data)
  }

  return (
    <div className="split-container">
      <header className="split-header">
        <h2>Cash Register</h2>
      </header>

      <aside className="split-left">
        <div>
          <div className="section-label">Upload File</div>
          <FileUpload onFileLoaded={(content) => setFileContent(content)} />
        </div>

        <div>
          <div className="section-label">Settings</div>
          <RulesBuilder
            config={config}
            supportedCurrencies={SUPPORTED_CURRENCIES}
            supportedStrategies={SUPPORTED_STRATEGIES}
            onChange={setConfig}
          />
        </div>

        <button
          className="btn btn-primary btn-full"
          disabled={!fileContent || isProcessing}
          onClick={handleProcess}
        >
          {isProcessing ? "Processing..." : "Process File"}
        </button>
      </aside>

      <main className="split-right">
        <div className="section-label">Results</div>

        {error ? <ErrorBanner message={error} onDismiss={() => setError(null)} /> : null}

        {isProcessing ? <ResultsTableSkeleton /> : null}

        {result && !isProcessing ? <ResultsTable response={result} /> : null}

        {!result && !isProcessing && !error ? (
          <div className="results-empty">
            Upload a file and click Process to see results
          </div>
        ) : null}
      </main>
    </div>
  )
}
