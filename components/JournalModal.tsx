import { useState } from 'react';

export default function JournalModal({ tradeId, onClose }: { tradeId: string; onClose: () => void }) {
  const [notes, setNotes] = useState('');
  const [emotionTag, setEmotionTag] = useState('calm');

  async function save() {
    await fetch('/api/journal/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tradeId, notes, emotionTag, planRespected: true, setupType: 'breakout' }),
    });
    onClose();
  }

  return (
    <div>
      <h3>Journal trade {tradeId}</h3>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      <select value={emotionTag} onChange={(e) => setEmotionTag(e.target.value)}>
        <option value="calm">calm</option><option value="fear">fear</option><option value="greed">greed</option>
      </select>
      <button onClick={save}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
