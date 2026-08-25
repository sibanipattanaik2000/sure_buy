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

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  saveAuthData,
  clearAuthData,
  getStoredUser,
  type User,
  type LoginPayload,
  type RegisterPayload,
} from "@/app/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("surebuy_token");

      if (!token) {
        setUser(null);
        return null;
      }

      const response = await getCurrentUser();

      if (!response.success || !response.data) {
        clearAuthData();
        setUser(null);
        return null;
      }

      setUser(response.data);

      localStorage.setItem(
        "surebuy_user",
        JSON.stringify(response.data)
      );

      return response.data;
    } catch {
      clearAuthData();
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser) {
      setUser(storedUser);
    }

    refreshUser().finally(() => {
      setLoading(false);
    });
  }, [refreshUser]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await loginUser(payload);

      if (!response.success) {
        throw new Error(
          response.message || "Login failed"
        );
      }

      if (!response.token || !response.data) {
        throw new Error(
          "Invalid login response from server"
        );
      }

      saveAuthData(response.token, response.data);
      setUser(response.data);

      return response.data;
    },
    []
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await registerUser(payload);

      if (!response.success) {
        throw new Error(
          response.message || "Registration failed"
        );
      }

      if (!response.token || !response.data) {
        throw new Error(
          "Invalid registration response from server"
        );
      }

      saveAuthData(response.token, response.data);
      setUser(response.data);

      return response.data;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Clear local authentication even if the API request fails.
    } finally {
      clearAuthData();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}