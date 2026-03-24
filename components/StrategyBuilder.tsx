import { useState } from 'react';

export default function StrategyBuilder({ onResult }: { onResult: (v: unknown) => void }) {
  const [symbol, setSymbol] = useState('AAPL');
  const [strategy, setStrategy] = useState('ma_crossover');

  async function run() {
    const res = await fetch('/api/backtest/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, strategy, fast: 5, slow: 20 }),
    });
    onResult(await res.json());
  }

  return (
    <section>
      <label>Symbol<input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} /></label>
      <label>Strategy<select value={strategy} onChange={(e) => setStrategy(e.target.value)}><option value="ma_crossover">MA crossover</option><option value="bollinger_mean_reversion">Bollinger mean reversion</option></select></label>
      <button onClick={run}>Run backtest</button>
    </section>
  );
}
