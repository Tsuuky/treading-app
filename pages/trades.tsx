import { useState } from 'react';
import JournalModal from '../components/JournalModal';
import TradeHistoryTable from '../components/TradeHistoryTable';
import { usePortfolio } from '../hooks/usePortfolio';

export default function TradesPage() {
  const { state } = usePortfolio();
  const [tradeId, setTradeId] = useState<string | null>(null);

  return (
    <main className="container">
      <h1>Historique & Journal</h1>
      <TradeHistoryTable trades={state.trades} onJournal={setTradeId} />
      {tradeId && <JournalModal tradeId={tradeId} onClose={() => setTradeId(null)} />}
    </main>
  );
}
