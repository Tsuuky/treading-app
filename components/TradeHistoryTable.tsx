import { useMemo, useState } from 'react';
import type { Trade } from '../types/core';

const PAGE_SIZE = 10;

export default function TradeHistoryTable({ trades, onJournal }: { trades: Trade[]; onJournal: (id: string) => void }) {
  const [page, setPage] = useState(1);
  const paged = useMemo(() => trades.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [trades, page]);

  return (
    <section>
      <table>
        <thead><tr><th>Date</th><th>Symbol</th><th>Side</th><th>Qty</th><th>Price</th><th>PnL</th><th>Journal</th></tr></thead>
        <tbody>{paged.map((t) => <tr key={t.id}><td>{new Date(t.timestamp).toLocaleString()}</td><td>{t.symbol}</td><td>{t.side}</td><td>{t.qty}</td><td>{t.price.toFixed(2)}</td><td>{t.realizedPnlDelta.toFixed(2)}</td><td><button onClick={() => onJournal(t.id)}>✍️</button></td></tr>)}</tbody>
      </table>
      <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </section>
  );
}
