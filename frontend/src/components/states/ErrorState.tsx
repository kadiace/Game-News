import React from 'react'

export const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div
    role="alert"
    style={{
      padding: 16,
      borderRadius: 12,
      border: '1px solid #f5c2c7',
      background: '#fff5f5',
      color: '#b42318',
    }}
  >
    {message}
  </div>
)
