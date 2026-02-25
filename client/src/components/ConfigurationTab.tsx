import { useState, useEffect } from "react";
import type { ConfigResponse } from "../types/api";
import { getConfig, putConfig } from "../services/api";
import { ErrorBanner, SuccessBanner } from "./ui";

export function ConfigurationTab() {
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // form state
  const [divisor, setDivisor] = useState("");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    getConfig()
      .then((c) => {
        setConfig(c);
        setDivisor(String(c.randomDivisor));
        setCurrency(c.currencyCode);
      })
      .catch(() => setError("Failed to load configuration."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    const d = parseInt(divisor, 10);
    if (isNaN(d) || d <= 0) {
      setError("Random divisor must be a positive integer.");
      return;
    }
    try {
      const updated = await putConfig({ randomDivisor: d, currencyCode: currency });
      setConfig(updated);
      setDivisor(String(updated.randomDivisor));
      setCurrency(updated.currencyCode);
      setSuccess("Configuration saved.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading configuration...</p>;
  }

  return (
    <div className="max-w-md space-y-6">
      {/* Current values */}
      {config && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Current Settings
          </h3>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-500">Divisor:</span>{" "}
              <span className="font-medium">{config.randomDivisor}</span>
            </div>
            <div>
              <span className="text-gray-500">Currency:</span>{" "}
              <span className="font-medium">{config.currencyCode}</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Random Divisor</label>
          <p className="text-xs text-gray-400 mb-1">
            When the owed amount (in cents) is divisible by this number, random denominations are used.
          </p>
          <input
            type="number"
            min="1"
            value={divisor}
            onChange={(e) => setDivisor(e.target.value)}
            className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <div className="flex gap-4">
            {["USD", "EUR"].map((code) => (
              <label key={code} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="currency"
                  value={code}
                  checked={currency === code}
                  onChange={() => setCurrency(code)}
                  className="accent-blue-600"
                />
                <span className="text-sm">{code}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessBanner message={success} />}
    </div>
  );
}
