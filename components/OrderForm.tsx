import { useMemo, useState } from 'react';

export default function OrderForm({ onPlaced }: { onPlaced: () => void }) {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [type, setType] = useState<'market' | 'limit'>('market');
  const [qty, setQty] = useState(0.01);
  const [limitPrice, setLimitPrice] = useState<number | undefined>();
  const disabled = useMemo(() => qty <= 0, [qty]);

  async function submit() {
    await fetch('/api/orders/place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, side, type, qty, qtyMode: 'units', limitPrice }),
    });
    onPlaced();
  }

  return (
    <section>
      <h2>Nouvel ordre</h2>
      <label>Symbol<input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} /></label>
      <label>Side<select value={side} onChange={(e) => setSide(e.target.value as 'buy' | 'sell')}><option value="buy">buy</option><option value="sell">sell</option></select></label>
      <label>Type<select value={type} onChange={(e) => setType(e.target.value as 'market' | 'limit')}><option value="market">market</option><option value="limit">limit</option></select></label>
      <label>Qty<input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} /></label>
      {type === 'limit' && <label>Limit<input type="number" value={limitPrice ?? ''} onChange={(e) => setLimitPrice(Number(e.target.value))} /></label>}
      <button disabled={disabled} onClick={submit}>Exécuter (simulé)</button>
    </section>
  );
}
