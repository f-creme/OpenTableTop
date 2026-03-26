// context/RoleContext.tsx

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type Role = "mj" | "player" | null

const RoleContext = createContext<{
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
        <RoleContext.Provider value={{ role, setRole}}>
            { children }
        </RoleContext.Provider>
    );
}

export const useRole = () => useContext(RoleContext);

