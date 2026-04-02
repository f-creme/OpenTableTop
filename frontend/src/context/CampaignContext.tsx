// src/context/CampaignContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CampaignContextType {
    campaignId: string | null
    setCampaignId: (id: string) => void
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
    // On initialise à partir de localStorage si disponible
    const [campaignId, setCampaignIdState] = useState<string | null>(() => {
        const saved = localStorage.getItem("campaignId");
        return saved ? String(saved) : null;
    });

    const setCampaignId = (id: string) => {
        setCampaignIdState(id);
        localStorage.setItem("campaignId", String(id));
    };

    return (
        <CampaignContext.Provider value={{ campaignId, setCampaignId }}>
            {children}
        </CampaignContext.Provider>
    );
}

export function useCampaign() {
    const context = useContext(CampaignContext);
    if (!context) throw new Error("useCampaign must be used within CampaignProvider");
    return context;
}