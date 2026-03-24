import type { Order, PortfolioState, Trade } from '../types/core';

export interface ExecutionConfig {
  feeBps: number;
  slippageBps: number;
}

/*
PSEUDOCODE EXECUTION ENGINE
- market fill: price = lastPrice * (1 +/- slippageBps)
- limit fill (backtest): if bar.low <= limit <= bar.high then fill
- partial close: closeQty = position.qty * pct
- realized pnl delta on close = (exit - avgEntry) * closedQty (direction aware)
- equity curve snapshot each fill/bar
*/
export function executeOrder(order: Order, lastPrice: number, portfolio: PortfolioState, cfg: ExecutionConfig): Trade {
  const slip = cfg.slippageBps / 10000;
  const price = order.type === 'market'
    ? order.side === 'buy'
      ? lastPrice * (1 + slip)
      : lastPrice * (1 - slip)
    : order.limitPrice ?? lastPrice;

  const notional = price * order.qty;
  const fees = notional * (cfg.feeBps / 10000);
  const trade: Trade = {
    id: crypto.randomUUID(),
    orderId: order.id,
    symbol: order.symbol,
    side: order.side,
    qty: order.qty,
    price,
    fees,
    slippage: Math.abs(price - lastPrice),
    timestamp: Date.now(),
    realizedPnlDelta: 0,
  };

  const pos = portfolio.positions.find((p) => p.symbol === order.symbol);
  if (order.side === 'buy') {
    portfolio.cash -= notional + fees;
    if (!pos) {
      portfolio.positions.push({ symbol: order.symbol, qty: order.qty, avgEntry: price, realizedPnl: 0, unrealizedPnl: 0 });
    } else {
      const newQty = pos.qty + order.qty;
      pos.avgEntry = (pos.avgEntry * pos.qty + price * order.qty) / newQty;
      pos.qty = newQty;
    }
  } else {
    if (pos) {
      const closeQty = Math.min(pos.qty, order.qty);
      const pnl = (price - pos.avgEntry) * closeQty;
      pos.qty -= closeQty;
      pos.realizedPnl += pnl - fees;
      trade.realizedPnlDelta = pnl - fees;
      portfolio.cash += price * closeQty - fees;
      if (pos.qty <= 0) portfolio.positions = portfolio.positions.filter((p) => p.symbol !== order.symbol);
    }
  }

  portfolio.equity = portfolio.cash + portfolio.positions.reduce((sum, p) => sum + p.qty * lastPrice, 0);
  portfolio.equityCurve.push({ ts: Date.now(), equity: portfolio.equity });

  return trade;
}

export function partialClose(positionQty: number, percent: number) {
  return Math.max(0, positionQty * Math.min(1, Math.max(0, percent)));
}
