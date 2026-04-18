import { FormEvent, useState } from 'react';
import { unsubscribe } from '../lib/api';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await unsubscribe(email);
      setMessage('Unsubscribed successfully.');
      setEmail('');
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to unsubscribe.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Unsubscribe</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', minWidth: 260 }}
        />
        <button type="submit" disabled={isSubmitting} style={{ padding: '8px 12px', borderRadius: 6 }}>
          {isSubmitting ? 'Submitting...' : 'Unsubscribe'}
        </button>
      </form>
      {message ? <p>{message}</p> : null}
    </main>
  );
}
