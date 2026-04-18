import React from 'react'

export const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ padding: 16, color: 'red' }}>Error: {message}</div>
)
