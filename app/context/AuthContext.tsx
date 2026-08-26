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
  type User,
  type LoginPayload,
  type RegisterPayload,
} from "@/app/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (
    payload: LoginPayload,
  ) => Promise<User>;

  register: (
    payload: RegisterPayload,
  ) => Promise<User>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<User | null>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser =
    useCallback(async () => {
      try {
        const response =
          await getCurrentUser();

        if (
          !response.success ||
          !response.data
        ) {
          setUser(null);
          return null;
        }

        setUser(response.data);

        return response.data;
      } catch {
        setUser(null);
        return null;
      }
    }, []);

  useEffect(() => {
    refreshUser().finally(() => {
      setLoading(false);
    });
  }, [refreshUser]);

  const login = useCallback(
    async (
      payload: LoginPayload,
    ) => {
      const response =
        await loginUser(payload);

      if (
        !response.success ||
        !response.data
      ) {
        throw new Error(
          response.message ||
            "Login failed",
        );
      }

      setUser(response.data.user);

      return response.data.user;
    },
    [],
  );

  const register = useCallback(
    async (
      payload: RegisterPayload,
    ) => {
      const response =
        await registerUser(payload);

      if (
        !response.success ||
        !response.data
      ) {
        throw new Error(
          response.message ||
            "Registration failed",
        );
      }

      return response.data;
    },
    [],
  );

  const logout = useCallback(
    async () => {
      try {
        await logoutUser();
      } finally {
        setUser(null);
      }
    },
    [],
  );

  const value =
    useMemo<AuthContextType>(
      () => ({
        user,
        loading,
        isAuthenticated:
          Boolean(user),
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
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}