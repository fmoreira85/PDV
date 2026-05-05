import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/layout/AppShell.jsx";
import { HistoryPage } from "./pages/HistoryPage.jsx";
import { PdvPage } from "./pages/PdvPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Redireciona a raiz para a tela principal do PDV. */}
        <Route index element={<Navigate to="/pdv" replace />} />
        <Route path="/pdv" element={<PdvPage />} />
        <Route path="/historico" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
}
