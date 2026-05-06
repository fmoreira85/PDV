import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

export function AuthLoadingScreen() {
  return (
    <main className="auth-loading">
      <div className="auth-loading-card">
        <span className="badge-soft">
          <i className="bi bi-shield-lock" /> Validando sessao
        </span>
        <h1>Preparando o caixa</h1>
        <p>Estamos conferindo sua autenticacao para liberar o PDV com seguranca.</p>
      </div>
    </main>
  );
}

export function ProtectedRoute({ children }) {
  const { status, isAuthenticated } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}

export function GuestRoute({ children }) {
  const { status, isAuthenticated } = useAuth();

  if (status === "loading") {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/pdv" replace />;
  }

  return children;
}
