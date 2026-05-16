import { useState, useEffect, useCallback } from "react";
import type { UserProfile } from "./api";
import { getMe, saveToken, clearTokens } from "./api";

// ── Simple event emitter for cross-component state ────────────────────────────
type Listener = () => void;
const listeners = new Set<Listener>();
function emit() { listeners.forEach((l) => l()); }

// ── Auth state ────────────────────────────────────────────────────────────────
let _user: UserProfile | null = null;
let _loading = true;

export function getUser() { return _user; }
export function isLoading() { return _loading; }

export function setAuth(token: string, refresh: string, user: UserProfile) {
  saveToken(token, refresh);
  _user = user;
  _loading = false;
  emit();
}

export function logout() {
  clearTokens();
  _user = null;
  _loading = false;
  emit();
}

// ── React hook ────────────────────────────────────────────────────────────────
export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(_user);
  const [loading, setLoading] = useState(_loading);

  useEffect(() => {
    const sync = () => {
      setUser(_user);
      setLoading(_loading);
    };
    listeners.add(sync);

    // Bootstrap on first mount
    if (_loading) {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("sv_token") : null;
      if (token) {
        getMe()
          .then((u) => {
            _user = u;
            _loading = false;
            emit();
          })
          .catch(() => {
            clearTokens();
            _user = null;
            _loading = false;
            emit();
          });
      } else {
        _loading = false;
        emit();
      }
    }

    return () => { listeners.delete(sync); };
  }, []);

  const doLogout = useCallback(() => { logout(); }, []);

  return { user, loading, logout: doLogout, isAuthenticated: !!user };
}
