import type { ChangeResponse, ConfigResponse } from "../types/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const problem = await res.json().catch(() => null);
    throw new Error(problem?.detail ?? `Server error ${res.status}`);
  }
  return res.json();
}

export async function calculateFile(file: File): Promise<ChangeResponse[]> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/change/calculate", { method: "POST", body: form });
  return handleResponse(res);
}

export async function calculateSingle(owed: number, paid: number): Promise<ChangeResponse> {
  const res = await fetch("/api/change/calculate-single", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ owed, paid }),
  });
  return handleResponse(res);
}

export async function getConfig(): Promise<ConfigResponse> {
  const res = await fetch("/api/config");
  return handleResponse(res);
}

export async function putConfig(body: {
  randomDivisor?: number;
  currencyCode?: string;
}): Promise<ConfigResponse> {
  const res = await fetch("/api/config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}
