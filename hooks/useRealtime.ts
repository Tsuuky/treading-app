import { useEffect, useRef, useState } from 'react';
import { computeBackoffMs } from '../utils/backoff';

export function useRealtime(symbols: string[]) {
  const [quotes, setQuotes] = useState<Record<string, number>>({});
  const attempts = useRef(0);

  const symbolKey = symbols.join(',');

  useEffect(() => {
    let closed = false;
    let timer: NodeJS.Timeout | null = null;

    const connect = () => {
      const es = new EventSource(`/api/market/realtime?symbols=${symbols.join(',')}`);
      es.onmessage = (evt) => {
        attempts.current = 0;
        setQuotes(JSON.parse(evt.data).quotes);
      };
      es.onerror = () => {
        es.close();
        attempts.current += 1;
        timer = setTimeout(connect, computeBackoffMs(attempts.current));
      };
      if (closed) es.close();
    };

    connect();
    return () => {
      closed = true;
      if (timer) clearTimeout(timer);
    };
  }, [symbolKey, symbols]);

  return quotes;
}
