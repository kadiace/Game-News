import React from 'react'
import { Link } from 'react-router-dom'
import { SubscribeForm } from '../components/subscribers/SubscribeForm'

const SubscribePage: React.FC = () => {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <Link to="/">← Back to home</Link>
      </div>
      <div>
        <h1 style={{ marginBottom: 8 }}>Subscribe</h1>
        <p style={{ marginTop: 0, color: '#475467', lineHeight: 1.6, maxWidth: 680 }}>
          Subscribe to keep the delivery flow ready while phase 1 remains focused on the text-first web experience.
        </p>
      </div>
      <SubscribeForm />
    </div>
  )
}

export default SubscribePage
