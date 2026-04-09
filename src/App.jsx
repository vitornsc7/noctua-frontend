import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastProvider } from "./components/UI";
import MainLayout from "./pages/layouts/MainLayout";
import HomePage from "./pages/home/HomePage";
import DashboardPage from "./pages/professor/DashboardPage";
import TurmasPage from "./pages/professor/turmas/TurmasPage";
import CadastroTurmaPage from "./pages/professor/turmas/CadastroTurmaPage";
import TurmaDetalhesPage from "./pages/professor/turmas/TurmaDetalhesPage";
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function PrivateRoute() {
  return isTokenValid() ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="turmas" element={<TurmasPage />} />
              <Route path="turmas/cadastro" element={<CadastroTurmaPage />} />
              <Route path="turmas/:id" element={<TurmaDetalhesPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
