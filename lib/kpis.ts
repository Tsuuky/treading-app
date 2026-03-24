import type { KPIReport, PortfolioState } from '../types/core';

export function computeKPIs(state: PortfolioState): KPIReport {
  const pnls = state.trades.map((t) => t.realizedPnlDelta);
  const wins = pnls.filter((p) => p > 0);
  const losses = pnls.filter((p) => p < 0);
  const total = pnls.length || 1;
  const winrate = wins.length / total;
  const avgWin = wins.length ? wins.reduce((a, b) => a + b, 0) / wins.length : 0;
  const avgLoss = losses.length ? Math.abs(losses.reduce((a, b) => a + b, 0) / losses.length) : 0;
  const expectancy = winrate * avgWin - (1 - winrate) * avgLoss;
  const grossProfit = wins.reduce((a, b) => a + b, 0);
  const grossLossAbs = Math.abs(losses.reduce((a, b) => a + b, 0));
  const profitFactor = grossLossAbs === 0 ? grossProfit : grossProfit / grossLossAbs;

  const eq = state.equityCurve.map((e) => e.equity);
  const returns = eq.slice(1).map((x, i) => (x - eq[i]) / eq[i]).filter((v) => Number.isFinite(v));
  const mean = returns.length ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const variance = returns.length ? returns.reduce((s, r) => s + (r - mean) ** 2, 0) / returns.length : 0;
  const std = Math.sqrt(variance);
  const sharpeAnnualized = std === 0 ? 0 : (mean / std) * Math.sqrt(252);

  let peak = -Infinity;
  let maxDrawdown = 0;
  for (const v of eq) {
    peak = Math.max(peak, v);
    maxDrawdown = Math.max(maxDrawdown, (peak - v) / peak);
  }

  const turnover = state.trades.reduce((s, t) => s + Math.abs(t.qty * t.price), 0) /
    (eq.length ? eq.reduce((a, b) => a + b, 0) / eq.length : 1);

  return {
    winrate,
    expectancy,
    profitFactor,
    sharpeAnnualized,
    maxDrawdown,
    turnover,
    nbTrades: state.trades.length,
    avgWin,
    avgLoss,
    timeInMarket: state.positions.length > 0 ? 1 : 0,
  };
}
