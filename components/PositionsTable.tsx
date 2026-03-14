import type { Position } from '../types/core';

export default function PositionsTable({ positions }: { positions: Position[] }) {
  return (
    <section>
      <h2>Positions</h2>
      <table>
        <thead><tr><th>Symbol</th><th>Qty</th><th>AvgEntry</th><th>Realized</th><th>Unrealized</th></tr></thead>
        <tbody>{positions.map((p) => <tr key={p.symbol}><td>{p.symbol}</td><td>{p.qty}</td><td>{p.avgEntry.toFixed(2)}</td><td>{p.realizedPnl.toFixed(2)}</td><td>{p.unrealizedPnl.toFixed(2)}</td></tr>)}</tbody>
      </table>
    </section>
  );
}
