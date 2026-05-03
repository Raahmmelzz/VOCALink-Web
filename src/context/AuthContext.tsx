<<<<<<< Updated upstream
import { createContext, useContext, useState, type ReactNode } from 'react';
import api from '../services/api';
=======
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginPayload, SignupPayload } from '../types/auth';
>>>>>>> Stashed changes

// Define the shape of our context
interface AuthContextType {
<<<<<<< Updated upstream
    token: string | null;
    login: (credentials: any) => Promise<void>;
    signup: (credentials: any) => Promise<void>;
    logout: () => void;
=======
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  signup: (credentials: SignupPayload) => Promise<void>;
  logout: () => void;
>>>>>>> Stashed changes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Check if the user already logged in previously
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const signup = async ({ username, email, password }: any) => {
        try {
            // Sends the data to the Django RegisterView
            await api.post('/users/', { username, email, password });
        } catch (error: any) {
            throw new Error(error.response?.data?.username?.[0] || "Registration failed. Username might be taken.");
        }
    };

<<<<<<< Updated upstream
    const login = async ({ identifier, password, remember }: any) => {
        try {
            // Django's default token auth requires 'username' and 'password'
            const response = await api.post('/login/', { 
                username: identifier, 
                password: password 
            });
            
            const fetchedToken = response.data.token;
            setToken(fetchedToken);
            
            // Save token to browser storage
            if (remember) {
                localStorage.setItem('token', fetchedToken);
            } else {
                sessionStorage.setItem('token', fetchedToken);
            }
        } catch (error: any) {
            throw new Error("Invalid username or password.");
        }
    };
=======
    loadUser();
  }, []);

  const signup = async (credentials: SignupPayload) => {
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
        console.error("Backend rejected signup:", errorData);
        throw new Error('Failed to create account. Email might already exist.');
      }

      console.log("User successfully saved to DB!");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const login = async ({ identifier, password, remember }: LoginPayload) => {
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

      // The React Bouncer!
      if (data.status !== 'TEACHER') {
        throw new Error('Access Denied: This web portal is for Teachers only. Please use the mobile app.');
      }

      // Handle token variations just in case FastAPI uses access_token instead of access
      const accessToken = data.access || data.access_token;
      const refreshToken = data.refresh || data.refresh_token;

      // Save the real tokens
      if (remember) {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      } else {
        sessionStorage.setItem('access_token', accessToken);
      }

      setToken(accessToken);

      // 💥 FIX 1: Immediately use the token to fetch the user details!
      const profileResponse = await fetch('https://vocalink-fastapi.onrender.com/api/users/me/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        setUser(userData); 
      } else {
        // Fallback if the profile fetch fails but login succeeded
        setUser({ id: "", username: identifier, email: identifier });
      }
>>>>>>> Stashed changes

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ token, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};