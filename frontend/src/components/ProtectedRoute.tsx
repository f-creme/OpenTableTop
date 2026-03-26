// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom"
import { useRole } from "../context/RoleContext"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute() {
  const { role } = useRole()
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/" replace />
  }

  if (!role) {
    return <Navigate to="/room" replace />
  }

  return <Outlet />
}