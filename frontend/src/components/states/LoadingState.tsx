import React from 'react'

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading today\'s curated game news…' }) => (
  <div
    role="status"
    style={{
      padding: 16,
      borderRadius: 12,
      border: '1px solid #d0d7de',
      background: '#f8fafc',
      color: '#334155',
    }}
  >
    {message}
  </div>
)
