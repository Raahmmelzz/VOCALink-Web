import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import authService from "../services/authService";
import type { User, LoginPayload, SignupPayload } from "../types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  signup: (data: SignupPayload) => Promise<void>;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Session
  useEffect(() => {
    const session = authService.getSession();
    if (session) setUser(session);
    setIsLoading(false);
  }, []);

  // Use useCallback so these functions don't change on every render
  const login = useCallback(async (data: LoginPayload) => {
    const loggedUser = authService.login(data);
    setUser(loggedUser);
  }, []);

  const signup = useCallback(async (data: SignupPayload) => {
    authService.signup(data);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((newData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      authService.saveSession(updated); // Sync with localStorage/Service
      return updated;
    });
  }, []);

  // useMemo ensures the 'value' object only changes when user or isLoading changes
  const value = useMemo(() => ({
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUser
  }), [user, isLoading, login, signup, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
} 