import { samplePortfolio } from "../data/samplePortfolio";
import type { Portfolio } from "../types/portfolio";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

export async function getPortfolio(signal?: AbortSignal): Promise<Portfolio> {
  const response = await fetch(`${API_URL}/api/v1/portfolio`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Portfolio request failed with status ${response.status}`);
  }

  return (await response.json()) as Portfolio;
}

export function getSamplePortfolio(): Portfolio {
  return samplePortfolio;
}
