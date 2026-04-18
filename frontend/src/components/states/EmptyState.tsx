import React from 'react'

export const EmptyState: React.FC<{ message?: string }> = ({ message = 'Nothing here yet' }) => (
  <div
    style={{
      padding: 16,
      borderRadius: 12,
      border: '1px dashed #cbd5e1',
      background: '#f8fafc',
      color: '#475467',
    }}
  >
    {message}
  </div>
)
