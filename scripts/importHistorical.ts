import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'paper.db'));
db.exec(`
CREATE TABLE IF NOT EXISTS ohlcv(symbol TEXT, ts INTEGER, o REAL, h REAL, l REAL, c REAL, v REAL, source TEXT, tz TEXT);
CREATE TABLE IF NOT EXISTS orders(id TEXT, userId TEXT, symbol TEXT, side TEXT, type TEXT, qty REAL, status TEXT, createdAt INTEGER);
CREATE TABLE IF NOT EXISTS trades(id TEXT, orderId TEXT, symbol TEXT, side TEXT, qty REAL, price REAL, fees REAL, slippage REAL, timestamp INTEGER, realizedPnlDelta REAL);
CREATE TABLE IF NOT EXISTS journal_entries(tradeId TEXT, notes TEXT, emotionTag TEXT, planRespected INTEGER, setupType TEXT, updatedAt INTEGER);
CREATE TABLE IF NOT EXISTS portfolio_snapshots(ts INTEGER, cash REAL, equity REAL);
`);

const insert = db.prepare('INSERT INTO ohlcv(symbol, ts, o, h, l, c, v, source, tz) VALUES (@symbol,@ts,@o,@h,@l,@c,@v,@source,@tz)');

for (const symbol of ['AAPL', 'MSFT', 'BTCUSDT', 'ETHUSDT']) {
  const rows = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/mock', `${symbol}.json`), 'utf8'));
  const tx = db.transaction(() => {
    for (const r of rows) insert.run({ symbol, ...r, source: 'mock', tz: 'UTC' });
  });
  tx();
}

console.log('Mock OHLCV imported into paper.db');
