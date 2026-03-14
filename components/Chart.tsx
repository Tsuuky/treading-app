import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export default function Chart({ symbol }: { symbol: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, { height: 320, layout: { background: { color: '#0b1020' }, textColor: '#d8e0ff' } });
    const series = chart.addLineSeries();
    fetch(`/api/market/history?symbol=${symbol}`).then((r) => r.json()).then((data) => {
      series.setData(data.bars.map((b: { ts: number; c: number }) => ({ time: Math.floor(b.ts / 1000), value: b.c })));
    });
    return () => chart.remove();
  }, [symbol]);

  return <div ref={ref} />;
}
