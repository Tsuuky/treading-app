import { computeKPIs } from '../lib/kpis';
import type { PortfolioState } from '../types/core';

export default function KPIPanel({ portfolio }: { portfolio: PortfolioState }) {
  const k = computeKPIs(portfolio);
  return (
    <section className="grid">
      <div>Cash: {portfolio.cash.toFixed(2)}</div>
      <div>Equity: {portfolio.equity.toFixed(2)}</div>
      <div>Winrate: {(k.winrate * 100).toFixed(1)}%</div>
      <div>Expectancy: {k.expectancy.toFixed(2)}</div>
      <div>Profit factor: {k.profitFactor.toFixed(2)}</div>
      <div>Max DD: {(k.maxDrawdown * 100).toFixed(2)}%</div>
    </section>
  );
}
