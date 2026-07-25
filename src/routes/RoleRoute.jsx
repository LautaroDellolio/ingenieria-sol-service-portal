import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLE_HOME_PATH } from '../lib/constants'
import Spinner from '../components/ui/Spinner'

export default function RoleRoute({ allow }) {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Spinner label="Verificando permisos…" />
      </div>
    )
  }

  if (!profile || !allow.includes(profile.role)) {
    const fallbackPath = profile ? ROLE_HOME_PATH[profile.role] : '/login'
    return <Navigate to={fallbackPath} replace />
  }

  return <Outlet />
}
