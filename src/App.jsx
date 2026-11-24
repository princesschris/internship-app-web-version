import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StudentLayout from './components/layout/StudentLayout'
import Dashboard from './pages/student/Dashboard'
import ExploreInternships from './pages/student/ExploreInternships'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/student" replace />} />
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="explore" element={<ExploreInternships />} />
          <Route path="*" element={<p className="px-6 py-20 text-center text-muted">This page is coming soon.</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}