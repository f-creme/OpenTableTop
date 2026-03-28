// src/context/CampaignContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CampaignContextType {
    campaignId: number | null
    setCampaignId: (id: number) => void
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
    // On initialise à partir de localStorage si disponible
    const [campaignId, setCampaignIdState] = useState<number | null>(() => {
        const saved = localStorage.getItem("campaignId");
        return saved ? Number(saved) : null;
    });

    const setCampaignId = (id: number) => {
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