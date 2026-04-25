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

  const signup = async (credentials: any) => {
    try {
      // 1. Generate a safe username for Django
      const generatedUsername = credentials.email.split('@')[0] + Math.floor(Math.random() * 10000);

      // 2. Send the request to Django
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: generatedUsername,
          email: credentials.email,
          full_name: credentials.profile.name, // Extracts the name from the profile object
          status: credentials.userType === 'teacher' ? 'TEACHER' : 'STUDENT',
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Django rejected signup:", errorData);
        throw new Error('Failed to create account. Email might already exist.');
      }

      console.log("User & Profile successfully saved to Django DB!");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const login = async ({ identifier, password, remember }: any) => {
    try {
  
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier, // Changed this to identifier!
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();

      // 2. The React Bouncer!
      if (data.status !== 'TEACHER') {
        throw new Error('Access Denied: This web portal is for Teachers only. Please use the mobile app.');
      }

      // 3. Save the real tokens from Django
      if (remember) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
      } else {
        sessionStorage.setItem('access_token', data.access);
      }

      // 4. Update state
      setToken(data.access);
      setUser({ identifier } as any); 

    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Passes the error to the UI
    }
  };

  const logout = () => {
    // Clear everything when logging out
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