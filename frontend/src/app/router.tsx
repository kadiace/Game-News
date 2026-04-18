import React from 'react'
import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import TopicPage from '../pages/TopicPage'
import SubscribePage from '../pages/SubscribePage'
import UnsubscribePage from '../pages/UnsubscribePage'

const AppLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#111827' }}>
      <header style={{ borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <Link to="/" style={{ color: '#111827', textDecoration: 'none', fontSize: 24, fontWeight: 700 }}>
              Game News
            </Link>
            <p style={{ margin: '6px 0 0', color: '#475467' }}>Daily text-first coverage across eight fixed game industry topics.</p>
          </div>
          <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link to="/">Home</Link>
            <Link to="/subscribe">Subscribe</Link>
            <Link to="/unsubscribe">Unsubscribe</Link>
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: 24 }}>
        <Outlet />
      </div>
    </div>
  )
}

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/topics/:topicKey" element={<TopicPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
