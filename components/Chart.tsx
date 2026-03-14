import { useEffect, useRef } from 'react';
import { LineSeries, createChart } from 'lightweight-charts';

type CompatChart = ReturnType<typeof createChart> & {
  addLineSeries?: () => { setData: (data: Array<{ time: number; value: number }>) => void };
};

export default function Chart({ symbol }: { symbol: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const chart = createChart(ref.current, {
      height: 320,
      layout: { background: { color: '#0b1020' }, textColor: '#d8e0ff' },
    }) as CompatChart;

    const series = typeof chart.addLineSeries === 'function'
      ? chart.addLineSeries()
      : chart.addSeries(LineSeries, {});

    fetch(`/api/market/history?symbol=${symbol}`)
      .then((r) => r.json())
      .then((data: { bars: Array<{ ts: number; c: number }> }) => {
        series.setData(data.bars.map((b) => ({ time: Math.floor(b.ts / 1000), value: b.c })));
      });

    return () => chart.remove();
  }, [symbol]);

  return <div ref={ref} />;
}
