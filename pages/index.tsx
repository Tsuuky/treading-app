import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container">
      <h1>Paper Trading Éducatif</h1>
      <p>Simulation multi-actifs (actions + crypto), environnement fictif.</p>
      <nav className="grid">
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/trades">Trades & Journal</Link>
        <Link href="/backtest">Backtests</Link>
        <Link href="/settings">Paramètres</Link>
      </nav>
    </main>
  );
}
