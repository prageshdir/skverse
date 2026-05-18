"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: string;
  xp: number;
  streak: number;
  communities: string[];
}

let _user: AppUser | null = null;
let _loading = true;
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((fn) => fn());
}

async function loadProfile(supaUser: User) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", supaUser.id)
    .single();

  _user = {
    id: supaUser.id,
    email: data?.email ?? supaUser.email ?? "",
    name: data?.name ?? supaUser.user_metadata?.name ?? supaUser.email?.split("@")[0] ?? "User",
    avatar_url: data?.avatar_url ?? supaUser.user_metadata?.avatar_url,
    role: data?.role ?? "learner",
    xp: data?.xp ?? 0,
    streak: data?.streak ?? 0,
    communities: data?.communities ?? [],
  };
}

let _bootstrapped = false;
let _realtimeChannel: RealtimeChannel | null = null;

function subscribeProfileRealtime(userId: string) {
  if (_realtimeChannel) {
    supabase.removeChannel(_realtimeChannel);
  }
  _realtimeChannel = supabase
    .channel(`profile:${userId}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
      (payload) => {
        if (_user && payload.new) {
          const p = payload.new as Record<string, unknown>;
          _user = {
            ..._user,
            xp: (p.xp as number) ?? _user.xp,
            streak: (p.streak as number) ?? _user.streak,
            name: (p.name as string) ?? _user.name,
            avatar_url: (p.avatar_url as string | undefined) ?? _user.avatar_url,
            communities: (p.communities as string[]) ?? _user.communities,
          };
          notify();
        }
      }
    )
    .subscribe();
}

async function bootstrap() {
  if (_bootstrapped) return;
  _bootstrapped = true;

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    await loadProfile(session.user);
    subscribeProfileRealtime(session.user.id);
  }
  _loading = false;
  notify();

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      await loadProfile(session.user);
      subscribeProfileRealtime(session.user.id);
    } else {
      _user = null;
      if (_realtimeChannel) {
        supabase.removeChannel(_realtimeChannel);
        _realtimeChannel = null;
      }
    }
    _loading = false;
    notify();
  });
}

export async function signInWithSupabase(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (data.user) await loadProfile(data.user);
  _loading = false;
  notify();
  return data;
}

export async function signUpWithSupabase(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw new Error(error.message);
  if (data.user) await loadProfile(data.user);
  _loading = false;
  notify();
  return data;
}

export function logout() {
  supabase.auth.signOut();
  _user = null;
  _loading = false;
  notify();
}

export interface AuthState {
  user: AppUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [, rerender] = useState(0);

  useEffect(() => {
    const handler = () => rerender((n) => n + 1);
    _listeners.add(handler);
    bootstrap();
    return () => { _listeners.delete(handler); };
  }, []);

  const handleLogout = useCallback(() => logout(), []);

  return {
    user: _user,
    loading: _loading,
    isAuthenticated: _user !== null,
    logout: handleLogout,
  };
}
