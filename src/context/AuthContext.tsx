import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  signup: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. Check if the user already logged in previously
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
  );
  
  // 2. If we have a token, we pretend the user is logged in for now
  const [user, setUser] = useState<User | null>(
    token ? { identifier: 'Teacher' } as any : null 
  );

  const signup = async ({ fullName, email, password }: any) => {
    // We will wire this to Django later! 
    console.log("Signup triggered for:", fullName);
  };

  const login = async ({ identifier, password, remember }: any) => {
    try {
      // 3. Send the real request to Django
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: identifier, // Django expects 'username' even if we type an email!
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();

      // 4. Save the real tokens from Django
      if (remember) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
      } else {
        sessionStorage.setItem('access_token', data.access);
      }

      // 5. Update React State
      setToken(data.access);
      setUser({ identifier } as any); 

    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    // 6. Clear everything when logging out
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};