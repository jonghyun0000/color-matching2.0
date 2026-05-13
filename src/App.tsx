import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import UploadPage from '@/pages/UploadPage'
import ExtractPage from '@/pages/ExtractPage'
import ResultPage from '@/pages/ResultPage'
import ManualColorPage from '@/pages/ManualColorPage'
import FavoritesPage from '@/pages/FavoritesPage'
import HistoryPage from '@/pages/HistoryPage'
import SettingsPage from '@/pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      {/* 하단 탭 있는 화면 */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 풀스크린 (탭 없음) */}
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/extract" element={<ExtractPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/manual-color" element={<ManualColorPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
