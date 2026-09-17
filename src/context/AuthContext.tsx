"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedUsers } from "@/lib/seed-data";
import type { Role, SessionUser, User } from "@/lib/types";

const USERS_KEY = "le-dms-users";
const SESSION_KEY = "le-dms-session";

type AuthContextValue = {
  user: SessionUser | null;
  ready: boolean;
  login: (email: string, password: string) => string | null;
  signup: (input: {
    name: string;
    email: string;
    password: string;
    badgeNumber: string;
    unit: string;
    role: Role;
  }) => string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toSession(user: User): SessionUser {
  const { password: _password, ...session } = user;
  void _password;
  return session;
}

function readUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
  try {
    const parsed = JSON.parse(raw) as User[];
    return parsed.length ? parsed : seedUsers;
  } catch {
    return seedUsers;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const users = readUsers();
    const sessionRaw = localStorage.getItem(SESSION_KEY);
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw) as SessionUser;
        const stillValid = users.some((item) => item.id === session.id);
        if (stillValid) setUser(session);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setReady(true);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const users = readUsers();
    const match = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password,
    );
    if (!match) return "Invalid badge credentials. Check email and password.";
    const session = toSession(match);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return null;
  }, []);

  const signup = useCallback(
    (input: {
      name: string;
      email: string;
      password: string;
      badgeNumber: string;
      unit: string;
      role: Role;
    }) => {
      const users = readUsers();
      if (users.some((item) => item.email.toLowerCase() === input.email.toLowerCase())) {
        return "An account already exists for this email.";
      }
      const created: User = {
        id: `usr-${crypto.randomUUID().slice(0, 8)}`,
        ...input,
      };
      const next = [...users, created];
      localStorage.setItem(USERS_KEY, JSON.stringify(next));
      const session = toSession(created);
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return null;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, signup, logout }),
    [user, ready, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
