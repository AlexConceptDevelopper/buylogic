import { Navigate, Outlet } from "react-router-dom";

export default function SuperAdminRoute() {
  const superAdminToken = localStorage.getItem("super_admin_token");

  if (!superAdminToken) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return <Outlet />;
}