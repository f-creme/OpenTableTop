// src/context/ProfileContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ProfileContextType {
    publicName: string | null
    setPublicName: (name: string) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [publicName, setPublicNameState] = useState<string | null>(() => {
        const saved = localStorage.getItem("publicName");
        return saved ? saved : null;
    });

    const setPublicName = (name: string) => {
        setPublicNameState(name);
        localStorage.setItem("publicName", String(name));
    };

    return (
        <ProfileContext.Provider value={{ publicName, setPublicName }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (!context) throw new Error("useCampaign must be used within ProfileProvider");
    return context;
}