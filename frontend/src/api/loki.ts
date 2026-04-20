import type { LokiResult } from '../types';

const LOKI_BASE = '/loki';

export async function queryLogs(
  query: string,
  start: number,
  end: number,
  limit = 100,
): Promise<LokiResult> {
  const params = new URLSearchParams({
    query,
    start: (start * 1e9).toString(),
    end: (end * 1e9).toString(),
    limit: limit.toString(),
  });
  const url = `${LOKI_BASE}/loki/api/v1/query_range?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Loki query failed: ${res.status}`);
  return res.json();
}
