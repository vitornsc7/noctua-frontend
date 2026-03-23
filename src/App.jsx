import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/UI";
import MainLayout from "./pages/layouts/MainLayout";
import HomePage from "./pages/home/HomePage";
import DashboardPage from "./pages/professor/DashboardPage";
import TurmasPage from "./pages/professor/turmas/TurmasPage";
import CadastroTurmaPage from "./pages/professor/turmas/CadastroTurmaPage";

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="turmas" element={<TurmasPage />} />
            <Route path="turmas/cadastro" element={<CadastroTurmaPage />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}
