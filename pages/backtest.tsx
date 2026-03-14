import { useState } from 'react';
import StrategyBuilder from '../components/StrategyBuilder';

export default function BacktestPage() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  return (
    <main className="container">
      <h1>Backtesting Daily</h1>
      <StrategyBuilder onResult={setResult} />
      <pre>{result ? JSON.stringify(result, null, 2) : 'Aucun résultat'}</pre>
    </main>
  );
}
