import { create } from 'zustand';

export type AuthRole = 'user' | 'admin' | null;

interface AuthState {
  role: AuthRole;
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (role: AuthRole, token: string, userId?: string) => void;
  logout: () => void;
  hydrate: () => void;
}

const AUTH_KEY = 'bumpa_auth';

function saveAuth(role: AuthRole, token: string, userId?: string) {
  const data = JSON.stringify({ role, token, userId });
  localStorage.setItem(AUTH_KEY, data);
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

function loadAuth(): { role: AuthRole; token: string | null; userId: string | null } {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { role: null, token: null, userId: null };
    const { role, token, userId } = JSON.parse(raw);
    return { role, token, userId };
  } catch {
    return { role: null, token: null, userId: null };
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadAuth(),
  isAuthenticated: !!loadAuth().token,
  login: (role, token, userId) => {
    set({ role, token, userId: userId || null, isAuthenticated: true });
    saveAuth(role, token, userId);
  },
  logout: () => {
    set({ role: null, token: null, userId: null, isAuthenticated: false });
    clearAuth();
  },
  hydrate: () => {
    const { role, token, userId } = loadAuth();
    set({ role, token, userId, isAuthenticated: !!token });
  }
}));
