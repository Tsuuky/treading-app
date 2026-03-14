import type { Order, PortfolioState, Trade } from '../types/core';

const state: PortfolioState = {
  cash: 100000,
  equity: 100000,
  positions: [],
  openOrders: [],
  trades: [],
  equityCurve: [{ ts: Date.now(), equity: 100000 }],
};

export function getState() {
  return state;
}

export function resetState() {
  state.cash = 100000;
  state.equity = 100000;
  state.positions = [];
  state.openOrders = [];
  state.trades = [];
  state.equityCurve = [{ ts: Date.now(), equity: 100000 }];
}

export function addOrder(order: Order) {
  state.openOrders.push(order);
}

export function addTrade(trade: Trade) {
  state.trades.unshift(trade);
}
