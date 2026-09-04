import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { AuthProvider } from "./context/AuthContext";
import NotificationsPage from "./pages/NotificationsPage";
import ParamsPage from "./pages/ParamsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import SuppliersPage from "./pages/SuppliersPage";
import StockPage from "./pages/StockPage";
import PurchaseOrdersPage from "./pages/PurchaseOrdersPage";
import PurchaseOrderDetailPage from "./pages/PurchaseOrderDetailPage";
import PurchaseOrderFormPage from "./pages/PurchaseOrderFormPage";
import ConsumptionImportPage from "./pages/ImportHubPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard"; 
import { ReceivePurchaseOrderPage } from "./pages/ReceivePurchaseOrderPage";
import SuperAdminLoginPage from "./pages/SuperAdminLoginPage";
import SuperAdminRoute from "./components/SuperAdminRoute";
import ResetPasswordPage from "./pages/ResetPasswordPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Private (Utilisateurs classiques) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/stock" element={<StockPage />} />
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/purchase-orders/new" element={<PurchaseOrderFormPage />} />
              <Route path="/purchase-orders/:id/receive" element={<ReceivePurchaseOrderPage />} />
              <Route path="/purchase-orders/:id/edit" element={<PurchaseOrderFormPage />} />
              <Route path="/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />
              <Route path="/consumption-import" element={<ConsumptionImportPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />

              {/* Route réservée aux rôles OWNER et SUPER_ADMIN */}
              <Route element={<RoleRoute allowedRoles={["OWNER", "SUPER_ADMIN"]} />}>
                <Route path="/params" element={<ParamsPage />} />
              </Route>
            </Route>
          </Route>

          {/* Espace Super-Admin (Isolé avec son propre token) */}
          <Route element={<SuperAdminRoute />}>
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}