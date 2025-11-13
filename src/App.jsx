import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-bg text-primary">
      <h2 className="text-2xl font-bold mb-4">Sobre o Projeto</h2>
      <p className="mb-4">Este é um exemplo usando Vite, React, TailwindCSS, React Router e PrimeReact.</p>
      <p className="text-accent hover:text-accentDark flex items-center cursor-pointer">
        <i className="pi pi-home mr-2"></i>
        Texto colorido
      </p>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("theme-default");

  useEffect(() => {
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}