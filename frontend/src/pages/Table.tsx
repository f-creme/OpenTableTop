// pages/Table.tsx
import { useRole } from "../context/RoleContext"
import { useCampaign } from "../context/CampaignContext";
// import { useTranslation } from "react-i18next";

import DiceMenu from "../components/DiceMenu";
import DiceResults from "../components/DiceResults";
import MapSelector from "../components/MapSelector";
import MapDisplay from "../components/MapDisplay";
import TokenSelector from "../components/TokenSelector";
import { useMaps } from "../hooks/useMaps";
import { useDice } from "../hooks/useDice";
import { useTableSocket } from "../hooks/useTableSocket";
import { useIllustrations } from "../hooks/useIllustration";
import { useTokens } from "../hooks/useTokens";
import IllustrationSelector from "../components/IllustrationSelector";
import { useEffect, useRef } from "react";
import type { Token } from "../types/token";

const Table = () => {
    const { role } = useRole();
    const { campaignId } = useCampaign();

    const apiURL = import.meta.env.VITE_API_URL;

    const {maps, selectedMap, setSelectedMap} = useMaps();
    const {illustrations, selectedIllustration, setSelectedIllustration} = useIllustrations();
    const { tokens, activeTokens, setActiveTokens, ToggleToken } = useTokens()
    const dice = useDice();

    const { send } = useTableSocket({
        campaignId,
        apiURL,
        onMapUpdate: setSelectedMap,
        onIllusUpdate: setSelectedIllustration,
        onDiceResult: dice.handleDiceResult,
        setActiveToken: setActiveTokens
    });

    const changeMap = (mapName: string) => {
        send({ type: "map_change", selected_map: mapName });
    };
    const changeIllustration = (illusName: string | null) => {
        send({ type: "illustration_change", selected_illustration: illusName})
    }

    const rollDices = (die: number) => {
        send({
            type: "dice_roll",
            dice: die,
            count: dice.countDices
        });
    };

    const prevActiveRef = useRef<Token[]>([]);

    useEffect(() => {
        if (!send) return;

        const prevActive = prevActiveRef.current;

        const added = activeTokens.filter(
            (t) => !prevActive.some((p) => p.id === t.id)
        )

        const removed = prevActive.filter(
            (t) => !activeTokens.some((p) => p.id === t.id)
        )

        added.forEach((t) => send({type: "token_update", action: "add", token: t}));
        removed.forEach((t) => send({type: "token_update", action: "remove", token: t}));

        prevActiveRef.current = activeTokens;
    }, [activeTokens, send])

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-col gap-4 flex-1 p-4 items-center">

                <div className="bg-base-300 w-2/3 max-w-4xl mx-auto mt-4 p-2 rounded-2xl shadow-2xl relative z-20">
                    <ul className="flex items-center justify-center gap-6">
                        <li>
                            <MapSelector
                                role={role}
                                maps={maps}
                                selectedMap={selectedMap}
                                changeMap={changeMap}
                            />
                        </li>

                        <li>
                            <IllustrationSelector
                                role={role}
                                illustrations={illustrations}
                                selectedIllustration={selectedIllustration}
                                changeIllustration={changeIllustration}
                            />
                        </li>

                        <li>
                            <TokenSelector
                                role={role}
                                tokens={tokens}
                                activeTokens={activeTokens}
                                toggleToken={ToggleToken}
                            />
                        </li>

                        <li>
                            <DiceMenu
                                dices={[4,6,10,12,20,50,100]}
                                countDices={dice.countDices}
                                setCountDices={dice.setCountDices}
                                rollDices={rollDices}
                            />
                        </li>
                    </ul>
                </div>

                <DiceResults {...dice} />

                <div className="flex-1 flex items-center justify-center min-h-0">
                    <MapDisplay 
                        role={role}
                        apiURL={apiURL}
                        selectedMap={selectedMap} 
                        campaignId={Number(campaignId)} 
                        selectedIllustration={selectedIllustration} 
                        activeTokens={activeTokens}
                        send={send}
                    />
                </div>

            </div>
        </div>
    );
};

export default Table;