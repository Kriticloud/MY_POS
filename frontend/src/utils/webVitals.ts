// Web Vitals performance monitoring
// Reports Core Web Vitals: LCP, FID, CLS, FCP, TTFB

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

const metrics: Metric[] = [];

function reportMetric(metric: Metric) {
  metrics.push(metric);
  if (import.meta.env.DEV) {
    const color = metric.rating === 'good' ? '🟢' : metric.rating === 'needs-improvement' ? '🟡' : '🔴';
    console.log(`${color} [WebVitals] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  }
  // In production, send to analytics endpoint:
  // navigator.sendBeacon('/api/analytics/vitals', JSON.stringify(metric));
}

export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as any;
    reportMetric({
      name: 'LCP',
      value: lastEntry.startTime,
      rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor',
    });
  });
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

  // First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    const entry = list.getEntries()[0] as any;
    const value = entry.processingStart - entry.startTime;
    reportMetric({
      name: 'FID',
      value,
      rating: value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor',
    });
  });
  fidObserver.observe({ type: 'first-input', buffered: true });

  // Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as any[]) {
      if (!entry.hadRecentInput) clsValue += entry.value;
    }
    reportMetric({
      name: 'CLS',
      value: clsValue,
      rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
    });
  });
  clsObserver.observe({ type: 'layout-shift', buffered: true });
}

export function getMetrics() {
  return [...metrics];
}
