import { createContext, useContext, useState, type ReactNode } from 'react';
import api from '../services/api';

// Define the shape of our context
interface AuthContextType {
    token: string | null;
    login: (credentials: any) => Promise<void>;
    signup: (credentials: any) => Promise<void>;
    logout: () => void;
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