import { useMemo } from 'react';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showValues?: boolean;
  formatValue?: (v: number) => string;
}

export function SimpleBarChart({ data, height = 200, showValues = true, formatValue = String }: BarChartProps) {
  const max = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            {showValues && <span className="text-[10px] font-medium text-gray-500">{formatValue(d.value)}</span>}
            <div className="w-full rounded-t-md transition-all duration-500"
              style={{ height: `${h}%`, backgroundColor: d.color || '#3B82F6', minHeight: d.value > 0 ? 4 : 0 }} />
            <span className="text-[10px] text-gray-500 truncate max-w-full">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function SimpleDonutChart({ data, size = 160, centerLabel, centerValue }: DonutChartProps) {
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const r = size / 2 - 10;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map(d => {
    const pct = total > 0 ? d.value / total : 0;
    const seg = { ...d, pct, dasharray: `${pct * circumference} ${circumference}`, offset };
    offset += pct * circumference;
    return seg;
  });

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="20" className="dark:stroke-gray-700" />
        {segments.map((seg, i) => (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={seg.color} strokeWidth="20"
            strokeDasharray={seg.dasharray} strokeDashoffset={-seg.offset} className="transition-all duration-500" />
        ))}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <span className="text-lg font-bold text-gray-900 dark:text-white">{centerValue}</span>}
          {centerLabel && <span className="text-xs text-gray-500">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function Sparkline({ data, width = 120, height = 40, color = '#3B82F6' }: SparklineProps) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  formatValue?: (v: number) => string;
}

export function SimpleLineChart({ data, height = 200, color = '#3B82F6', formatValue = String }: LineChartProps) {
  const max = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);
  const min = useMemo(() => Math.min(...data.map(d => d.value), 0), [data]);
  const range = max - min || 1;
  const w = 100;
  const h = 100;

  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * w : w / 2;
    const y = h - ((d.value - min) / range) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <div style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h + 20}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon fill="url(#lineGradient)" points={areaPoints} />
        <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => {
          const x = data.length > 1 ? (i / (data.length - 1)) * w : w / 2;
          const y = h - ((d.value - min) / range) * (h - 10) - 5;
          return <circle key={i} cx={x} cy={y} r="1.5" fill={color} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      <div className="flex justify-between mt-1">
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((d, i) => (
          <span key={i} className="text-[9px] text-gray-400">{d.label}</span>
        ))}
      </div>
    </div>
  );
}
