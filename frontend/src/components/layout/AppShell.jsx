import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

function navClassName({ isActive }) {
  // O estado ativo da rota controla o destaque visual da aba.
  return `pdv-tab ${isActive ? "active" : ""}`;
}

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <main className="app-shell">
      {/* Cabecalho fixo com contexto geral do sistema. */}
      <header className="topbar">
        <div>
          <p className="eyebrow">Ponto de Venda autenticado</p>
          <h1>Sistema PDV</h1>
        </div>

        <div className="topbar-actions">
          <div className="topbar-metrics">
            <span className="metric-pill">
              <i className="bi bi-graph-up-arrow" /> Hoje: <strong>operacao ao vivo</strong>
            </span>
            <span className="metric-pill muted">
              <i className="bi bi-receipt-cutoff" /> Fluxo integrado
            </span>
          </div>

          <div className="operator-card">
            <div>
              <p className="eyebrow">Operador conectado</p>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>

            <button type="button" className="logout-button" onClick={logout}>
              <i className="bi bi-box-arrow-right" /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Navegacao principal entre operacao de venda e consulta de historico. */}
      <nav className="tab-switcher" aria-label="Navegacao principal">
        <NavLink to="/pdv" className={navClassName}>
          <i className="bi bi-cart3" /> PDV
        </NavLink>
        <NavLink to="/historico" className={navClassName}>
          <i className="bi bi-clock-history" /> Historico
        </NavLink>
      </nav>

      {/* As paginas filhas sao renderizadas aqui pelo React Router. */}
      <Outlet />
    </main>
  );
}
