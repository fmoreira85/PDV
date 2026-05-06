import { createContext, useContext, useEffect, useState } from "react";

import { fetchCurrentUser, loginUser, registerUser } from "../api/authApi.js";
import { setAuthToken } from "../api/client.js";

const AuthContext = createContext(null);
const storageKey = "pdv.auth.session";

function readStoredSession() {
  try {
    const rawValue = window.localStorage.getItem(storageKey);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (_error) {
    return null;
  }
}

function writeStoredSession(session) {
  window.localStorage.setItem(storageKey, JSON.stringify(session));
}

function clearStoredSession() {
  window.localStorage.removeItem(storageKey);
}

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [session, setSession] = useState(null);

  useEffect(() => {
    let isActive = true;
    const storedSession = readStoredSession();

    if (!storedSession?.token) {
      setAuthToken(null);
      setStatus("unauthenticated");
      return () => {
        isActive = false;
      };
    }

    setAuthToken(storedSession.token);

    async function restoreSession() {
      try {
        const profileResponse = await fetchCurrentUser();

        if (!isActive) {
          return;
        }

        const nextSession = {
          token: storedSession.token,
          user: profileResponse.user
        };

        writeStoredSession(nextSession);
        setSession(nextSession);
        setStatus("authenticated");
      } catch (_error) {
        if (!isActive) {
          return;
        }

        clearStoredSession();
        setAuthToken(null);
        setSession(null);
        setStatus("unauthenticated");
      }
    }

    restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  function completeAuthentication(authPayload) {
    const nextSession = {
      token: authPayload.token,
      user: authPayload.user
    };

    setAuthToken(nextSession.token);
    writeStoredSession(nextSession);
    setSession(nextSession);
    setStatus("authenticated");

    return nextSession;
  }

  async function login(credentials) {
    const authPayload = await loginUser(credentials);
    return completeAuthentication(authPayload);
  }

  async function register(payload) {
    const authPayload = await registerUser(payload);
    return completeAuthentication(authPayload);
  }

  function logout() {
    clearStoredSession();
    setAuthToken(null);
    setSession(null);
    setStatus("unauthenticated");
  }

  return (
    <AuthContext.Provider
      value={{
        status,
        user: session?.user ?? null,
        isAuthenticated: status === "authenticated",
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider.");
  }

  return context;
}
