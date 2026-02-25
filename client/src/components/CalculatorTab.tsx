import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import type { ChangeResponse } from "../types/api";
import { calculateFile, calculateSingle } from "../services/api";
import { Badge, ErrorBanner } from "./ui";

export function CalculatorTab() {
  // -- file upload state --
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [batchResults, setBatchResults] = useState<ChangeResponse[] | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // -- single calc state --
  const [owed, setOwed] = useState("");
  const [paid, setPaid] = useState("");
  const [singleResult, setSingleResult] = useState<ChangeResponse | null>(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleBatchCalc = async () => {
    if (!file) return;
    setBatchLoading(true);
    setBatchError(null);
    setBatchResults(null);
    try {
      const results = await calculateFile(file);
      setBatchResults(results);
    } catch (err: unknown) {
      setBatchError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBatchLoading(false);
    }
  };

  const handleSingleCalc = async () => {
    const o = parseFloat(owed);
    const p = parseFloat(paid);
    if (isNaN(o) || isNaN(p)) {
      setSingleError("Please enter valid numbers for both fields.");
      return;
    }
    setSingleLoading(true);
    setSingleError(null);
    setSingleResult(null);
    try {
      const result = await calculateSingle(o, p);
      setSingleResult(result);
    } catch (err: unknown) {
      setSingleError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSingleLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ---- File Upload Section ---- */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Batch File Upload</h2>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInput.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          <input
            ref={fileInput}
            type="file"
            accept=".txt,.csv"
            className="hidden"
            onChange={handleFileChange}
          />
          {file ? (
            <p className="text-gray-700">
              <span className="font-medium">{file.name}</span>{" "}
              <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
            </p>
          ) : (
            <p className="text-gray-500">
              Drag &amp; drop a <span className="font-medium">.txt</span> or{" "}
              <span className="font-medium">.csv</span> file here, or click to browse
            </p>
          )}
        </div>

        <div className="mt-3 flex gap-3">
          <button
            onClick={handleBatchCalc}
            disabled={!file || batchLoading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {batchLoading ? "Calculating..." : "Calculate"}
          </button>
          {file && (
            <button
              onClick={() => { setFile(null); setBatchResults(null); setBatchError(null); }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {batchError && (
          <div className="mt-3">
            <ErrorBanner message={batchError} onDismiss={() => setBatchError(null)} />
          </div>
        )}

        {batchResults && batchResults.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-2 font-medium">#</th>
                  <th className="px-4 py-2 font-medium">Owed</th>
                  <th className="px-4 py-2 font-medium">Paid</th>
                  <th className="px-4 py-2 font-medium">Change</th>
                  <th className="px-4 py-2 font-medium">Denominations</th>
                  <th className="px-4 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {batchResults.map((r, i) => (
                  <tr key={i} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2">${r.owed.toFixed(2)}</td>
                    <td className="px-4 py-2">${r.paid.toFixed(2)}</td>
                    <td className="px-4 py-2 font-medium">${r.change.toFixed(2)}</td>
                    <td className="px-4 py-2 text-gray-700">{r.formatted || "—"}</td>
                    <td className="px-4 py-2">
                      {r.isRandom && (
                        <Badge color="bg-amber-100 text-amber-700">random</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ---- Divider ---- */}
      <hr className="border-gray-200" />

      {/* ---- Single Transaction ---- */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Single Transaction</h2>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Owed ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={owed}
              onChange={(e) => setOwed(e.target.value)}
              placeholder="2.12"
              className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Paid ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              placeholder="3.00"
              className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={handleSingleCalc}
            disabled={singleLoading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {singleLoading ? "..." : "Calculate"}
          </button>
        </div>

        {singleError && (
          <div className="mt-3 max-w-md">
            <ErrorBanner message={singleError} onDismiss={() => setSingleError(null)} />
          </div>
        )}

        {singleResult && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Change</span>
              <span className="text-xl font-semibold">${singleResult.change.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-700">{singleResult.formatted || "No change"}</p>
            {singleResult.isRandom && (
              <div className="mt-2">
                <Badge color="bg-amber-100 text-amber-700">random</Badge>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
