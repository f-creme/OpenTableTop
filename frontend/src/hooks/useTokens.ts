// hooks/useTokens.tsx
import { useEffect, useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import type { Token } from "../types/token";
import { getTokens } from "../api/services/mapServices";

export const useTokens = () => {
  const { campaignId } = useCampaign();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeTokens, setActiveTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (!campaignId) return;

    getTokens(campaignId)
      .then((tokens) => setTokens(tokens))
      .catch((err) => console.log(err));
  }, []);

  const ToggleToken = (b: boolean, token: Token) => {
    if (b === true && !activeTokens.some((t) => t.id === token.id)) {
      setActiveTokens((prev) => [...prev, token]);
    } else if (b === false && activeTokens.some((t) => t.id === token.id)) {
      setActiveTokens((prev) => prev.filter((t) => t.id !== token.id));
    }
  };

  return {
    tokens,
    activeTokens,
    setActiveTokens,
    ToggleToken,
  };
};
