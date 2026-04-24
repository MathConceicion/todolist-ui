import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TarefasPage from './pages/TarefasPage'
import TarefaDetailPage from './pages/TarefaDetailPage'
import AppLayout from './components/AppLayout'

function PrivateRoute({ children }) {
  const { isAuth, loading } = useAuth()
  if (loading) return null
  return isAuth ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isAuth, loading } = useAuth()
  if (loading) return null
  return isAuth ? <Navigate to="/app" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            {/* Protected */}
            <Route path="/app" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="tarefas" element={<TarefasPage />} />
              <Route path="tarefas/:id" element={<TarefaDetailPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
