import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

function getErrorMessage(error, fallbackMessage) {
  return error.response?.data?.message ?? fallbackMessage;
}

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const nextPath = location.state?.from?.pathname ?? "/pdv";

  function handleFieldChange(field) {
    return (event) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value
      }));
    };
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setError("");
    setForm((currentForm) => ({
      ...currentForm,
      name: nextMode === "register" ? currentForm.name : "",
      password: ""
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      if (mode === "login") {
        await login({
          email: form.email,
          password: form.password
        });
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password
        });
      }

      navigate(nextPath, { replace: true });
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          mode === "login"
            ? "Nao foi possivel entrar no sistema agora."
            : "Nao foi possivel concluir o cadastro agora."
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-hero">
        <span className="badge-soft">
          <i className="bi bi-shop-window" /> Caixa protegido
        </span>
        <h1>PDV pronto para operacao segura.</h1>
        <p>
          Entre com um operador cadastrado ou crie um novo acesso para liberar vendas,
          historico e consulta de produtos.
        </p>

        <div className="auth-highlights">
          <article>
            <strong>Login rapido</strong>
            <p>Email e senha para voltar ao caixa sem reconfigurar a estacao.</p>
          </article>
          <article>
            <strong>Cadastro direto</strong>
            <p>Novo operador pode criar acesso pela propria tela inicial do sistema.</p>
          </article>
          <article>
            <strong>Rotas protegidas</strong>
            <p>Produtos, vendas e historico agora exigem autenticacao valida.</p>
          </article>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-card-header">
          <p className="eyebrow">Acesso ao sistema</p>
          <h2>{mode === "login" ? "Entrar no PDV" : "Cadastrar operador"}</h2>
        </div>

        <div className="auth-toggle" role="tablist" aria-label="Alternar formulario">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => handleModeChange("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => handleModeChange("register")}
          >
            Cadastro
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <label className="field-group">
              <span>Nome</span>
              <input
                type="text"
                value={form.name}
                onChange={handleFieldChange("name")}
                placeholder="Ex.: Caixa Joana"
                minLength={3}
                required
              />
            </label>
          ) : null}

          <label className="field-group">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={handleFieldChange("email")}
              placeholder="operador@loja.com"
              required
            />
          </label>

          <label className="field-group">
            <span>Senha</span>
            <input
              type="password"
              value={form.password}
              onChange={handleFieldChange("password")}
              placeholder="Minimo de 6 caracteres"
              minLength={6}
              required
            />
          </label>

          {error ? <p className="feedback error">{error}</p> : null}

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting
              ? "Processando..."
              : mode === "login"
                ? "Entrar"
                : "Criar acesso e entrar"}
          </button>
        </form>

        <p className="helper-text">
          {mode === "login"
            ? "Ainda sem acesso? Abra a aba Cadastro para criar o primeiro operador."
            : "Depois do cadastro, o sistema ja entra com a nova sessao autenticada."}
        </p>
      </section>
    </main>
  );
}
