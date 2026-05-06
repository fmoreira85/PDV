import { Navigate, Route, Routes } from "react-router-dom";

import {
  AuthLoadingScreen,
  GuestRoute,
  ProtectedRoute
} from "./components/auth/RouteGuards.jsx";
import { AppShell } from "./components/layout/AppShell.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { HistoryPage } from "./pages/HistoryPage.jsx";
import { PdvPage } from "./pages/PdvPage.jsx";

function RootRedirect() {
  const { status, isAuthenticated } = useAuth();

  if (status === "loading") {
    return <AuthLoadingScreen />;
  }

  return <Navigate to={isAuthenticated ? "/pdv" : "/auth"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/auth"
        element={
          <GuestRoute>
            <AuthPage />
          </GuestRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/pdv" element={<PdvPage />} />
        <Route path="/historico" element={<HistoryPage />} />
      </Route>
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
