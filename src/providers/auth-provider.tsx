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
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import {
  ApiError,
  registerRefreshHandler,
  resetRefreshHandler,
} from "@/lib/api/client";
import { tokenManager } from "@/lib/auth/token-manager";
import { getRoleHomePath } from "@/lib/permissions/routes";
import type { AuthState, CurrentUser, LoginRequest } from "@/types/auth";
type AuthContextValue = AuthState & {
  login: (input: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
  initializeSession: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const refreshSession = useCallback(async () => {
    try {
      const result = await authApi.refresh();
      tokenManager.set(result.accessToken);
      const currentUser = await authApi.me();
      setUser(currentUser);
      return result.accessToken;
    } catch {
      tokenManager.clear();
      setUser(null);
      return null;
    }
  }, []);
  const initializeSession = useCallback(async () => {
    if (!tokenManager.get()) {
      await refreshSession();
      setLoading(false);
      return;
    }
    try {
      setUser(await authApi.me());
    } catch (error) {
      if (error instanceof ApiError && error.code === "TOKEN_EXPIRED") {
        await refreshSession();
      } else {
        tokenManager.clear();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [refreshSession]);
  useEffect(() => {
    registerRefreshHandler(refreshSession);
    void initializeSession();
    return resetRefreshHandler;
  }, [refreshSession, initializeSession]);
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken: tokenManager.get(),
      isAuthenticated: Boolean(user),
      isLoading,
      login: async (input) => {
        try {
          const result = await authApi.login(input);
          tokenManager.set(result.accessToken);
          const currentUser = await authApi.me();
          setUser(currentUser);
          router.push(getRoleHomePath(currentUser));
        } catch (error) {
          tokenManager.clear();
          setUser(null);
          throw error;
        }
      },
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          tokenManager.clear();
          setUser(null);
          router.push("/login");
        }
      },
      refreshSession,
      initializeSession,
    }),
    [user, isLoading, router, refreshSession, initializeSession],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
