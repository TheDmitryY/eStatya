import { useState, useEffect, useRef } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, BarChart, GaugeChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { queryRange, queryInstant } from '../../api/prometheus';
import { queryLogs } from '../../api/loki';
import { Activity, Server, Clock, AlertTriangle } from 'lucide-react';

echarts.use([
  LineChart,
  BarChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer,
]);

interface MetricCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export function DashboardPage() {
  const [requestRate, setRequestRate] = useState<[number, string][]>([]);
  const [latencyData, setLatencyData] = useState<[number, string][]>([]);
  const [errorRate, setErrorRate] = useState<string>('0');
  const [uptime, setUptime] = useState<string>('0');
  const [logs, setLogs] = useState<Array<{ ts: string; line: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchMetrics() {
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 3600;

    try {
      const [rateRes, latRes, errRes, uptimeRes] = await Promise.allSettled([
        queryRange(
          'rate(http_requests_total[5m])',
          oneHourAgo,
          now,
          '60s',
        ),
        queryRange(
          'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))',
          oneHourAgo,
          now,
          '60s',
        ),
        queryInstant('sum(rate(http_requests_total{status=~"5.."}[5m]))'),
        queryInstant('up{job="fastapi_app"}'),
      ]);

      if (rateRes.status === 'fulfilled' && rateRes.value.data.result.length > 0) {
        setRequestRate(rateRes.value.data.result[0].values ?? []);
      }
      if (latRes.status === 'fulfilled' && latRes.value.data.result.length > 0) {
        setLatencyData(latRes.value.data.result[0].values ?? []);
      }
      if (errRes.status === 'fulfilled' && errRes.value.data.result.length > 0) {
        setErrorRate(errRes.value.data.result[0].value?.[1] ?? '0');
      }
      if (uptimeRes.status === 'fulfilled' && uptimeRes.value.data.result.length > 0) {
        setUptime(uptimeRes.value.data.result[0].value?.[1] ?? '0');
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }

  async function fetchLogs() {
    try {
      const now = Math.floor(Date.now() / 1000);
      const fiveMinAgo = now - 300;
      const res = await queryLogs('{job="fastapi_app"}', fiveMinAgo, now, 50);
      const entries = res.data.result.flatMap((stream) =>
        stream.values.map(([ts, line]) => ({
          ts: new Date(Number(ts) / 1e6).toLocaleTimeString(),
          line,
        })),
      );
      setLogs(entries.reverse());
    } catch {
      // Logs are optional
    }
  }

  useEffect(() => {
    fetchMetrics();
    fetchLogs();
    intervalRef.current = setInterval(() => {
      fetchMetrics();
      fetchLogs();
    }, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const cards: MetricCard[] = [
    {
      label: 'Request Rate',
      value: requestRate.length > 0
        ? `${parseFloat(requestRate[requestRate.length - 1][1]).toFixed(2)} req/s`
        : '—',
      icon: <Activity size={20} />,
      color: 'text-accent',
    },
    {
      label: 'P95 Latency',
      value: latencyData.length > 0
        ? `${(parseFloat(latencyData[latencyData.length - 1][1]) * 1000).toFixed(0)} ms`
        : '—',
      icon: <Clock size={20} />,
      color: 'text-accent-green',
    },
    {
      label: 'Error Rate (5xx)',
      value: `${parseFloat(errorRate).toFixed(4)} /s`,
      icon: <AlertTriangle size={20} />,
      color: 'text-error',
    },
    {
      label: 'Service Status',
      value: uptime === '1' ? 'UP' : 'DOWN',
      icon: <Server size={20} />,
      color: uptime === '1' ? 'text-accent-green' : 'text-error',
    },
  ];

  const requestChartOption: echarts.EChartsCoreOption = {
    backgroundColor: 'transparent',
    grid: { top: 30, right: 20, bottom: 30, left: 50 },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: '#2a2e35' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
      splitLine: { lineStyle: { color: '#2a2e35', type: 'dashed' } },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#161a1e',
      borderColor: '#2a2e35',
      textStyle: { color: '#f0f0f2', fontSize: 12 },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#8b5cf6', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0.02)' },
          ]),
        },
        data: requestRate.map(([ts, val]) => [ts * 1000, parseFloat(val)]),
      },
    ],
  };

  const latencyChartOption: echarts.EChartsCoreOption = {
    backgroundColor: 'transparent',
    grid: { top: 30, right: 20, bottom: 30, left: 50 },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: '#2a2e35' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 11,
        formatter: (v: number) => `${(v * 1000).toFixed(0)}ms`,
      },
      splitLine: { lineStyle: { color: '#2a2e35', type: 'dashed' } },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#161a1e',
      borderColor: '#2a2e35',
      textStyle: { color: '#f0f0f2', fontSize: 12 },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#22c55e', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
            { offset: 1, color: 'rgba(34, 197, 94, 0.02)' },
          ]),
        },
        data: latencyData.map(([ts, val]) => [ts * 1000, parseFloat(val)]),
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-text-muted mt-1">Real-time application metrics</p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-error-bg text-error border border-error text-sm">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-muted">{card.label}</span>
              <span className={card.color}>{card.icon}</span>
            </div>
            <p className="text-xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Request Rate (req/s)</h3>
          <ReactEChartsCore
            echarts={echarts}
            option={requestChartOption}
            style={{ height: 280 }}
            notMerge
          />
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">P95 Latency</h3>
          <ReactEChartsCore
            echarts={echarts}
            option={latencyChartOption}
            style={{ height: 280 }}
            notMerge
          />
        </div>
      </div>

      {/* Logs */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Recent Logs (Loki)</h3>
        <div className="max-h-72 overflow-y-auto space-y-1 font-mono text-xs">
          {logs.length === 0 && (
            <p className="text-text-muted py-4 text-center">No logs available</p>
          )}
          {logs.map((entry, i) => (
            <div key={i} className="flex gap-3 py-1 border-b border-border/50">
              <span className="text-text-muted shrink-0">{entry.ts}</span>
              <span className="text-text-primary break-all">{entry.line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
