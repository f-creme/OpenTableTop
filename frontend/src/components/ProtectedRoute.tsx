// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom"
import { useRole } from "../context/RoleContext"

export default function ProtectedRoute() {
  const { role } = useRole()

  if (!role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}