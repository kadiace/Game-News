import { FormEvent, useState } from 'react';
import { subscribe } from '../../lib/api';

export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await subscribe(email);
      setMessage('Subscription request received. Please verify your email.');
      setEmail('');
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <label htmlFor="subscriber-email" style={{ fontWeight: 600 }}>
        Email address
      </label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          id="subscriber-email"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', minWidth: 260, flex: '1 1 260px' }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #111827', background: '#111827', color: '#ffffff' }}
        >
          {isSubmitting ? 'Submitting...' : 'Subscribe'}
        </button>
      </div>
      {message ? (
        <p aria-live="polite" style={{ margin: 0, color: message.toLowerCase().includes('failed') ? '#b42318' : '#067647' }}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
