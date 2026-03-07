import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/UI";
import MainLayout from "./pages/MainLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import TurmasPage from "./pages/TurmasPage";

export default function App() {
  const [theme, setTheme] = useState("theme-default");

  useEffect(() => {
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="turmas" element={<TurmasPage />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}
