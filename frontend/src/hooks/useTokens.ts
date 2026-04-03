// hooks/useTokens.tsx
import { useEffect, useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import type { Token, TokenAPI } from "../types/token";
import { getTokens } from "../api/services/mapServices";

export const useTokens = () => {
  const { campaignId } = useCampaign();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeTokens, setActiveTokens] = useState<Token[]>([]);

  const mapApiToken = ({uuid, file_name, x, y, scale}: TokenAPI): Token => ({
    uuid: uuid,
    fileName: file_name,
    x: x, 
    y: y, 
    scale: scale
  })

  useEffect(() => {
    if (!campaignId) return;

    getTokens(campaignId)
      .then((res) => {
        const tokens: Token[] = res.map(mapApiToken);
        setTokens(tokens)
      })
      .catch((err) => console.log(err));
  }, []);

  const ToggleToken = (b: boolean, token: Token) => {
    if (b === true && !activeTokens.some((t) => t.uuid === token.uuid)) {
      setActiveTokens((prev) => [...prev, token]);
    } else if (b === false && activeTokens.some((t) => t.uuid === token.uuid)) {
      setActiveTokens((prev) => prev.filter((t) => t.uuid !== token.uuid));
    }
  };

  return {
    tokens,
    activeTokens,
    setActiveTokens,
    ToggleToken,
  };
};
