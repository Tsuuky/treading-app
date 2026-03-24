import Chart from '../components/Chart';
import KPIPanel from '../components/KPIPanel';
import OrderForm from '../components/OrderForm';
import PositionsTable from '../components/PositionsTable';
import { usePortfolio } from '../hooks/usePortfolio';

export default function PortfolioPage() {
  const { state, refresh } = usePortfolio();

  return (
    <main className="container">
      <h1>Dashboard Portfolio</h1>
      <KPIPanel portfolio={state} />
      <Chart symbol="BTCUSDT" />
      <PositionsTable positions={state.positions} />
      <OrderForm onPlaced={refresh} />
    </main>
  );
}
