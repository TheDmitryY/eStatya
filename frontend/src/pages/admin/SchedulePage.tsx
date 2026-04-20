import { useState, useEffect } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { queryRange, queryInstant } from '../../api/prometheus';
import { CalendarClock, TrendingUp, Cpu, HardDrive } from 'lucide-react';

echarts.use([
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer,
]);

export function SchedulePage() {
  const [cpuData, setCpuData] = useState<[number, string][]>([]);
  const [memData, setMemData] = useState<[number, string][]>([]);
  const [reqByEndpoint, setReqByEndpoint] = useState<
    Array<{ endpoint: string; count: number }>
  >([]);
  const [activeConnections, setActiveConnections] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScheduleMetrics() {
      const now = Math.floor(Date.now() / 1000);
      const sixHoursAgo = now - 6 * 3600;

      try {
        const [cpuRes, memRes, endpointRes, connRes] =
          await Promise.allSettled([
            queryRange(
              'rate(process_cpu_seconds_total{job="fastapi_app"}[5m]) * 100',
              sixHoursAgo,
              now,
              '120s',
            ),
            queryRange(
              'process_resident_memory_bytes{job="fastapi_app"} / 1024 / 1024',
              sixHoursAgo,
              now,
              '120s',
            ),
            queryInstant(
              'sum by (handler) (increase(http_requests_total[1h]))',
            ),
            queryInstant(
              'sum(http_requests_in_progress{job="fastapi_app"})',
            ),
          ]);

        if (
          cpuRes.status === 'fulfilled' &&
          cpuRes.value.data.result.length > 0
        ) {
          setCpuData(cpuRes.value.data.result[0].values ?? []);
        }
        if (
          memRes.status === 'fulfilled' &&
          memRes.value.data.result.length > 0
        ) {
          setMemData(memRes.value.data.result[0].values ?? []);
        }
        if (endpointRes.status === 'fulfilled') {
          const endpoints = endpointRes.value.data.result
            .map((r) => ({
              endpoint: r.metric.handler ?? 'unknown',
              count: Math.round(parseFloat(r.value?.[1] ?? '0')),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
          setReqByEndpoint(endpoints);
        }
        if (
          connRes.status === 'fulfilled' &&
          connRes.value.data.result.length > 0
        ) {
          setActiveConnections(
            connRes.value.data.result[0].value?.[1] ?? '0',
          );
        }

        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch metrics',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchScheduleMetrics();
    const interval = setInterval(fetchScheduleMetrics, 60_000);
    return () => clearInterval(interval);
  }, []);

  const cpuChartOption: echarts.EChartsCoreOption = {
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
      name: '%',
      nameTextStyle: { color: '#9ca3af' },
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
            { offset: 0, color: 'rgba(139, 92, 246, 0.25)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0.02)' },
          ]),
        },
        data: cpuData.map(([ts, val]) => [ts * 1000, parseFloat(val)]),
      },
    ],
  };

  const memChartOption: echarts.EChartsCoreOption = {
    backgroundColor: 'transparent',
    grid: { top: 30, right: 20, bottom: 30, left: 60 },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: '#2a2e35' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      name: 'MB',
      nameTextStyle: { color: '#9ca3af' },
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
        lineStyle: { color: '#22c55e', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(34, 197, 94, 0.25)' },
            { offset: 1, color: 'rgba(34, 197, 94, 0.02)' },
          ]),
        },
        data: memData.map(([ts, val]) => [ts * 1000, parseFloat(val)]),
      },
    ],
  };

  const endpointChartOption: echarts.EChartsCoreOption = {
    backgroundColor: 'transparent',
    grid: { top: 10, right: 20, bottom: 30, left: 140 },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#2a2e35' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
      splitLine: { lineStyle: { color: '#2a2e35', type: 'dashed' } },
    },
    yAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: '#2a2e35' } },
      axisLabel: { color: '#9ca3af', fontSize: 11, width: 120, overflow: 'truncate' },
      data: reqByEndpoint.map((e) => e.endpoint).reverse(),
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#161a1e',
      borderColor: '#2a2e35',
      textStyle: { color: '#f0f0f2', fontSize: 12 },
    },
    series: [
      {
        type: 'bar',
        barWidth: 16,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#8b5cf6' },
            { offset: 1, color: '#a78bfa' },
          ]),
          borderRadius: [0, 4, 4, 0],
        },
        data: reqByEndpoint.map((e) => e.count).reverse(),
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
        <h1 className="text-2xl font-bold">Schedule & Metrics</h1>
        <p className="text-text-muted mt-1">
          System resource usage and endpoint analytics (6h window)
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-error-bg text-error border border-error text-sm">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-muted">CPU Usage</span>
            <Cpu size={20} className="text-accent" />
          </div>
          <p className="text-xl font-bold">
            {cpuData.length > 0
              ? `${parseFloat(cpuData[cpuData.length - 1][1]).toFixed(1)}%`
              : '—'}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-muted">Memory</span>
            <HardDrive size={20} className="text-accent-green" />
          </div>
          <p className="text-xl font-bold">
            {memData.length > 0
              ? `${parseFloat(memData[memData.length - 1][1]).toFixed(1)} MB`
              : '—'}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-muted">Active Connections</span>
            <TrendingUp size={20} className="text-accent" />
          </div>
          <p className="text-xl font-bold">
            {parseFloat(activeConnections).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <CalendarClock size={16} className="text-accent" />
            CPU Over Time
          </h3>
          <ReactEChartsCore
            echarts={echarts}
            option={cpuChartOption}
            style={{ height: 260 }}
            notMerge
          />
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <HardDrive size={16} className="text-accent-green" />
            Memory Over Time
          </h3>
          <ReactEChartsCore
            echarts={echarts}
            option={memChartOption}
            style={{ height: 260 }}
            notMerge
          />
        </div>
      </div>

      {/* Endpoint Breakdown */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">
          Top Endpoints (Last Hour)
        </h3>
        {reqByEndpoint.length > 0 ? (
          <ReactEChartsCore
            echarts={echarts}
            option={endpointChartOption}
            style={{ height: Math.max(200, reqByEndpoint.length * 35) }}
            notMerge
          />
        ) : (
          <p className="text-text-muted text-center py-8">
            No endpoint data available
          </p>
        )}
      </div>
    </div>
  );
}
