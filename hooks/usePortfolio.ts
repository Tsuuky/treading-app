import { useEffect, useState } from 'react';
import type { PortfolioState } from '../types/core';

const empty: PortfolioState = { cash: 0, equity: 0, positions: [], openOrders: [], trades: [], equityCurve: [] };

export function usePortfolio() {
  const [state, setState] = useState<PortfolioState>(empty);

  async function refresh() {
    const res = await fetch('/api/portfolio/state');
    const json = await res.json();
    setState(json.state);
  }

  useEffect(() => {
    const id = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  return { state, refresh };
}
