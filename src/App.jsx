import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect } from 'react';
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
import CentralDeAjudaPage from "./pages/ajuda/CentralDeAjudaPage";
import LancarFaltasPage from "./pages/professor/turmas/LancarFaltasPage";
import LimitesPage from "./pages/professor/configuration/LimitesPage";
import LancarNotasPage from "./pages/professor/turmas/LancarNotasPage";
import PoliticaPrivacidadePage from "./pages/PoliticaPrivacidadePage";
import TermosUsoPage from "./pages/TermosUsoPage";
import LandingPage from "./pages/LandingPage";

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

function PublicDocumentPage({ children }) {
  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousHtmlOverflowX = document.documentElement.style.overflowX;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverflowX = document.body.style.overflowX;

    document.documentElement.style.overflow = "auto";
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflow = "auto";
    document.body.style.overflowX = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overflowX = previousHtmlOverflowX;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overflowX = previousBodyOverflowX;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#F6F6F8]">
      <div className="mx-auto max-w-6xl p-8">
        {children}
      </div>
    </main>
  );
}

function RoleRoute({ allowedRoles }) {
  const { loading, role, isAuthenticated } = useAuth();
  const isResolvingRole = isTokenValid() && !role;

  if (loading || isResolvingRole) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/esqueci-minha-senha" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/politica-de-privacidade"
              element={
                <PublicDocumentPage>
                  <PoliticaPrivacidadePage />
                </PublicDocumentPage>
              }
            />
            <Route
              path="/termos-de-uso"
              element={
                <PublicDocumentPage>
                  <TermosUsoPage />
                </PublicDocumentPage>
              }
            />
            <Route path="/403" element={<ForbiddenPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route path="politica-de-privacidade" element={<PoliticaPrivacidadePage />} />
                <Route path="termos-de-uso" element={<TermosUsoPage />} />
                <Route path="documentos/politica-de-privacidade" element={<PoliticaPrivacidadePage />} />
                <Route path="documentos/termos-de-uso" element={<TermosUsoPage />} />

                <Route element={<RoleRoute allowedRoles={["PROFESSOR"]} />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="configuracoes" element={<ConfiguracoesPage />} />
                  <Route path="turmas" element={<TurmasPage />} />
                  <Route path="turmas/cadastro" element={<CadastroTurmaPage />} />
                  <Route path="turmas/:id" element={<TurmaDetalhesPage />} />
                  <Route path="turmas/:id/avaliacoes/nova" element={<NovaAvaliacaoPage />} />
                  <Route path="turmas/:id/avaliacoes/:avaliacaoId/editar" element={<NovaAvaliacaoPage />} />
                  <Route path="turmas/:id/avaliacoes/:avaliacaoId/lancar-notas" element={<LancarNotasPage />} />
                  <Route path="turmas/:id/avaliacoes/:avaliacaoId" element={<AvaliacaoDetalhesPage />} />
                  <Route path="turmas/:id/faltas/nova" element={<LancarFaltasPage />} />
                  <Route path="configuracoes/2fa" element={<TwoFactorSetupPage />} />
                  <Route path="configuracoes/limites" element={<LimitesPage />} />
                  <Route path="ajuda" element={<CentralDeAjudaPage />} />
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
