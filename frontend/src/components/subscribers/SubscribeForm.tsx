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
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        type="email"
        placeholder="Enter your email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', minWidth: 260 }}
      />
      <button type="submit" disabled={isSubmitting} style={{ padding: '8px 12px', borderRadius: 6 }}>
        {isSubmitting ? 'Submitting...' : 'Subscribe'}
      </button>
      {message ? <span>{message}</span> : null}
    </form>
  );
}
