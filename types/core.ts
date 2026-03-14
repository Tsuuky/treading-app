export type AssetType = 'stock' | 'crypto';

export interface Asset {
  id: string;
  symbol: string;
  type: AssetType;
  quoteCurrency: string;
  providerMapping: Record<string, string>;
}

export interface OHLCV {
  ts: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  tz: 'UTC';
}

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  qty: number;
  qtyMode: 'units' | 'notional' | 'percent_equity';
  limitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'open' | 'filled' | 'cancelled' | 'rejected';
  createdAt: number;
}

export interface Position {
  symbol: string;
  qty: number;
  avgEntry: number;
  realizedPnl: number;
  unrealizedPnl: number;
}

export interface Trade {
  id: string;
  orderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  qty: number;
  price: number;
  fees: number;
  slippage: number;
  timestamp: number;
  realizedPnlDelta: number;
}

export interface PortfolioState {
  cash: number;
  equity: number;
  positions: Position[];
  openOrders: Order[];
  trades: Trade[];
  equityCurve: Array<{ ts: number; equity: number }>;
}

export interface KPIReport {
  winrate: number;
  expectancy: number;
  profitFactor: number;
  sharpeAnnualized: number;
  maxDrawdown: number;
  turnover: number;
  nbTrades: number;
  avgWin: number;
  avgLoss: number;
  timeInMarket: number;
}
