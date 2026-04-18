import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import TopicPage from '../pages/TopicPage'
import SubscribePage from '../pages/SubscribePage'
import UnsubscribePage from '../pages/UnsubscribePage'

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/topics/:topicKey" element={<TopicPage />} />
      <Route path="/subscribe" element={<SubscribePage />} />
      <Route path="/unsubscribe" element={<UnsubscribePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AppRouter
