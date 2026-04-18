import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <main style={{ display: 'grid', gap: 16 }}>
      <div>
        <Link to="/">← Back to home</Link>
      </div>
      <div>
        <h1 style={{ marginBottom: 8 }}>Unsubscribe</h1>
        <p style={{ marginTop: 0, color: '#475467', lineHeight: 1.6, maxWidth: 680 }}>
          Remove your email from future deliveries. This keeps the subscription flow complete while the product is still in its text-first phase.
        </p>
      </div>
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
      {message ? <p style={{ margin: 0 }}>{message}</p> : null}
    </main>
  );
}
