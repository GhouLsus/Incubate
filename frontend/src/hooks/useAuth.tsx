import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "../types/auth";
import * as authApi from "../api/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: (redirect?: string) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKENS_KEY = "auth_tokens";
const USER_KEY = "auth_user";

const persistAuth = (response: AuthResponse) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    TOKENS_KEY,
    JSON.stringify({
      accessToken: response.access_token,
      refreshToken: response.refresh_token
    })
  );
  localStorage.setItem(USER_KEY, JSON.stringify(response.user));
};

const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKENS_KEY);
  localStorage.removeItem(USER_KEY);
};

export const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rawUser = localStorage.getItem(USER_KEY);
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser) as User;
        setUser(parsed);
      } catch (error) {
        console.error("Failed to parse stored user", error);
        clearAuth();
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = useCallback((response: AuthResponse) => {
    persistAuth(response);
    setUser(response.user);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authApi.login(payload);
    handleAuthSuccess(response);
  }, [handleAuthSuccess]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authApi.register(payload);
    handleAuthSuccess(response);
  }, [handleAuthSuccess]);

  const logout = useCallback(
    (redirect?: string) => {
      clearAuth();
      setUser(null);
      if (redirect) {
        router.push(redirect).catch((error) => console.error("Logout redirect failed", error));
      }
    },
    [router]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin"
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
