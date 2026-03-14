import { useState } from 'react';

export default function SettingsPage() {
  const [message, setMessage] = useState('');

  async function reset() {
    const res = await fetch('/api/portfolio/reset', { method: 'POST' });
    setMessage(res.ok ? 'Portfolio réinitialisé.' : 'Échec reset');
  }

  return (
    <main className="container">
      <h1>Paramètres de simulation</h1>
      <p>Application éducative, auth mock, non production-ready.</p>
      <button onClick={reset}>Reset paper portfolio</button>
      <p>{message}</p>
      <section>
        <h2>Aide</h2>
        <pre>{`graph TD\nA[Client] --> B[/api/market/quote]\nB --> C{Cache LRU/Redis}\nC -->|miss| D[Provider REST/WS]\nD --> E[Rate limiter token bucket]\nE --> A`}</pre>
      </section>
    </main>
  );
}
