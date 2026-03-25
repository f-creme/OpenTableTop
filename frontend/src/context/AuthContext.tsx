// context/AuthContext.tsx

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type Role = "mj" | "player" | null

const AuthContext = createContext<{
    role: Role;
    setRole: (role: Role) => void;
}>({
    role: null,
    setRole: () => {}
});

export function AuthProvider({ children }: { children: ReactNode}) {
    const [role, setRole] = useState<Role>(() => {
        return (localStorage.getItem("role") as Role) || null;
    })

    useEffect(() => {
        if (role) {
            localStorage.setItem("role", role);
        } else {
            localStorage.removeItem("role");
        }
    })

    return (
        <AuthContext.Provider value={{ role, setRole}}>
            { children }
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

