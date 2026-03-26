// context/AuthContext.tsx

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../api/axiosInstance";

interface AuthContextType {
    token: string | null;
    user: any | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<any>(null);
    
    const login = (token: string) => {
        localStorage.setItem("token", token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    // Check token validity
    useEffect(() => {
        if (!token) return;

        axiosInstance
            .get("/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => logout());
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
