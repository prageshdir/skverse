"use client";

import { useState, useEffect, useCallback } from "react";
import { getMe, clearTokens, saveToken, type UserProfile } from "./api";

// ─── Module-level state ───────────────────────────────────────────────────────

let _user: UserProfile | null = null;
let _loading = true;
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((fn) => fn());
}

// ─── Public setters ───────────────────────────────────────────────────────────

export function setAuth(token: string, refresh: string, user: UserProfile) {
  saveToken(token, refresh);
  _user = user;
  _loading = false;
  notify();
}

export function logout() {
  clearTokens();
  _user = null;
  _loading = false;
  notify();
}

// ─── Bootstrap (runs once per page load) ─────────────────────────────────────

let _bootstrapped = false;

async function bootstrap() {
  if (_bootstrapped) return;
  _bootstrapped = true;

  if (typeof window === "undefined") {
    _loading = false;
    notify();
    return;
  }

  const token = localStorage.getItem("sv_token");
  if (!token) {
    _loading = false;
    notify();
    return;
  }

  try {
    const user = await getMe();
    _user = user;
  } catch {
    clearTokens();
    _user = null;
  } finally {
    _loading = false;
    notify();
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [, rerender] = useState(0);

  useEffect(() => {
    const handler = () => rerender((n) => n + 1);
    _listeners.add(handler);
    // Kick off bootstrap the first time a component mounts
    bootstrap();
    return () => {
      _listeners.delete(handler);
    };
  }, []);

  const handleLogout = useCallback(() => logout(), []);

  return {
    user: _user,
    loading: _loading,
    isAuthenticated: _user !== null,
    logout: handleLogout,
  };
}
