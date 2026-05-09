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
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
  );
  
  const [user, setUser] = useState<User | null>(
    token ? { identifier: 'Teacher' } as any : null 
  );

  const signup = async (credentials: any) => {
    try {
      const response = await fetch('https://vocalink-fastapi.onrender.com/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          email: credentials.email,
          status: credentials.status,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup rejected:", errorData);
        throw new Error('Failed to create account. Email might already exist.');
      }

      console.log("User & Profile successfully saved!");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const login = async ({ identifier, password, remember }: any) => {
    try {
      const response = await fetch('https://vocalink-fastapi.onrender.com/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();

      if (data.status !== 'TEACHER') {
        throw new Error('Access Denied: This web portal is for Teachers only. Please use the mobile app.');
      }

      if (remember) {
        localStorage.setItem('access_token', data.access_token);
      } else {
        sessionStorage.setItem('access_token', data.access_token);
      }

      setToken(data.access_token);
      setUser({ identifier } as any);

    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
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