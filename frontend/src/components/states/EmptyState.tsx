import React from 'react'

export const EmptyState: React.FC<{ message?: string }> = ({ message = 'Nothing here yet' }) => (
  <div style={{ padding: 16 }}>{message}</div>
)
