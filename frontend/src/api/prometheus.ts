import type { PrometheusResult } from '../types';

const PROM_BASE = '/prometheus';

export async function queryInstant(query: string): Promise<PrometheusResult> {
  const url = `${PROM_BASE}/api/v1/query?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Prometheus query failed: ${res.status}`);
  return res.json();
}

export async function queryRange(
  query: string,
  start: number,
  end: number,
  step: string = '60s',
): Promise<PrometheusResult> {
  const params = new URLSearchParams({
    query,
    start: start.toString(),
    end: end.toString(),
    step,
  });
  const url = `${PROM_BASE}/api/v1/query_range?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Prometheus range query failed: ${res.status}`);
  return res.json();
}
