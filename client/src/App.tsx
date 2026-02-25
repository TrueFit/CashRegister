import { useState } from "react";
import { CalculatorTab } from "./components/CalculatorTab";
import { ConfigurationTab } from "./components/ConfigurationTab";

type Tab = "calculator" | "config";

const TABS: { key: Tab; label: string }[] = [
  { key: "calculator", label: "Calculator" },
  { key: "config", label: "Configuration" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("calculator");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <h1 className="text-xl font-bold text-gray-900">Cash Register</h1>
          <p className="text-sm text-gray-500 mt-0.5">Calculate change denominations for transactions</p>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 flex gap-6">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-8">
        {tab === "calculator" ? <CalculatorTab /> : <ConfigurationTab />}
      </main>
    </div>
  );
}
