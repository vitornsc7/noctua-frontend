import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastProvider } from "./components/UI";
import { isTokenValid } from './api/authApi';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from "./pages/layouts/MainLayout";
import DashboardPage from "./pages/professor/DashboardPage";
import ConfiguracoesPage from "./pages/professor/configuration/ConfiguracoesPage";
import TurmasPage from "./pages/professor/turmas/TurmasPage";
import CadastroTurmaPage from "./pages/professor/turmas/CadastroTurmaPage";
import TurmaDetalhesPage from "./pages/professor/turmas/TurmaDetalhesPage";
import NovaAvaliacaoPage from "./pages/professor/turmas/NovaAvaliacaoPage";
import AvaliacaoDetalhesPage from "./pages/professor/turmas/AvaliacaoDetalhesPage";
import LoginPage from "./pages/authentication/login/LoginPage";
import RegisterPage from "./pages/authentication/register/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ForbiddenPage from './pages/ForbiddenPage';
import TwoFactorSetupPage from "./pages/authentication/twoFactor/TwoFactorSetupPage";
import ForgotPasswordPage from "./pages/authentication/forgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/authentication/forgotPassword/ResetPasswordPage";
import MonitoramentoOperacionalPage from './pages/admin/MonitoramentoOperacionalPage';
import ConfiguracoesAdminPage from './pages/admin/ConfiguracoesAdminPage';
import NovaFaltaPage from "./pages/professor/turmas/NovaFaltaPage";

function PrivateRoute() {
  return isTokenValid() ? <Outlet /> : <Navigate to="/login" replace />;
}

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F6F8]">
      <i className="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
    </div>
  );
}

function RoleHomeRedirect() {
  const { loading, role } = useAuth();
  const isResolvingRole = isTokenValid() && !role;

  if (loading || isResolvingRole) {
    return <AuthLoadingScreen />;
  }

  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function RoleRoute({ allowedRoles }) {
  const { loading, role } = useAuth();
  const isResolvingRole = isTokenValid() && !role;

  if (loading || isResolvingRole) {
    return <AuthLoadingScreen />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/esqueci-minha-senha" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/403" element={<ForbiddenPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<RoleHomeRedirect />} />

                <Route element={<RoleRoute allowedRoles={["PROFESSOR"]} />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="configuracoes" element={<ConfiguracoesPage />} />
                  <Route path="turmas" element={<TurmasPage />} />
                  <Route path="turmas/cadastro" element={<CadastroTurmaPage />} />
                  <Route path="turmas/:id" element={<TurmaDetalhesPage />} />
                  <Route path="turmas/:id/avaliacoes/nova" element={<NovaAvaliacaoPage />} />
                  <Route path="turmas/:id/avaliacoes/:avaliacaoId" element={<AvaliacaoDetalhesPage />} />
                  <Route path="turmas/:id/faltas/nova" element={<NovaFaltaPage />} />
                  <Route path="configuracoes/2fa" element={<TwoFactorSetupPage />} />
                </Route>

                <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                  <Route path="admin" element={<MonitoramentoOperacionalPage />} />
                  <Route path="admin/configuracoes" element={<ConfiguracoesAdminPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}