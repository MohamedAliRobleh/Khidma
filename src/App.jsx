// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import WorkersList from './pages/WorkersList'
import WorkerProfile from './pages/WorkerProfile'
import About from './pages/About'
import AdminLogin from './pages/AdminLogin'
import AdminWorkers from './pages/AdminWorkers'
import AdminReviews from './pages/AdminReviews'
import WorkerApply from './pages/WorkerApply'
import EmployerAuth from './pages/EmployerAuth'
import EmployerDashboard from './pages/EmployerDashboard'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('khidma_admin_token')
  if (!token) return <Navigate to="/admin" replace />
  return children
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/bonnes" element={<PublicLayout><WorkersList /></PublicLayout>} />
        <Route path="/bonnes/:id" element={<PublicLayout><WorkerProfile /></PublicLayout>} />
        <Route path="/a-propos" element={<PublicLayout><About /></PublicLayout>} />

        {/* Worker self-registration */}
        <Route path="/rejoindre" element={<PublicLayout><WorkerApply /></PublicLayout>} />

        {/* Employer routes */}
        <Route path="/compte" element={<EmployerAuth />} />
        <Route path="/compte/tableau-de-bord" element={<EmployerDashboard />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/workers" element={
          <ProtectedRoute><AdminWorkers /></ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute><AdminReviews /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
