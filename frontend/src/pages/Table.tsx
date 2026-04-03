import { useRole } from "../context/RoleContext";
import { useCampaign } from "../context/CampaignContext";
import DiceMenu from "../components/DiceMenu";
import DiceResults from "../components/DiceResults";
import MapSelector from "../components/MapSelector";
import MapDisplay from "../components/MapDisplay";
import TokenSelector from "../components/TokenSelector";
import IllustrationSelector from "../components/IllustrationSelector";
import { useMaps } from "../hooks/useMaps";
import { useDice } from "../hooks/useDice";
import { useTableSocket } from "../hooks/useTableSocket";
import { useIllustrations } from "../hooks/useIllustration";
import { useTokens } from "../hooks/useTokens";
import { useEffect, useRef, useState } from "react";
import type { Token } from "../types/token";
import type { Player } from "../types/character";
import { RefreshCcw } from "lucide-react";
import CharacterCard from "../components/CharacterCard";

const Table = () => {
  const { role } = useRole();
  const { campaignId } = useCampaign();
  const apiURL = import.meta.env.VITE_API_URL;

  const { maps, selectedMap, setSelectedMap } = useMaps();
  const { illustrations, selectedIllustration, setSelectedIllustration } = useIllustrations();
  const { tokens, activeTokens, setActiveTokens, ToggleToken } = useTokens();
  const dice = useDice();

  const [activePlayers, setActivePlayers] = useState<Player[]>([]);

  useEffect(() => {
    console.log(activePlayers);
  }, [activePlayers]);

  const { send } = useTableSocket(
    setSelectedMap,
    setSelectedIllustration,
    dice.handleDiceResult,
    setActiveTokens,
    setActivePlayers
  );

  const changeMap = (mapUuid: string) => {
    send({ type: "map_change", selected_map: mapUuid });
  };

  const changeIllustration = (illusUuid: string | null) => {
    send({ type: "illustration_change", selected_illustration: illusUuid });
  };

  const rollDices = (die: number) => {
    send({ type: "dice_roll", dice: die, count: dice.countDices });
  };

  const prevActiveRef = useRef<Token[]>([]);

  useEffect(() => {
    if (!send) return;

    const prevActive = prevActiveRef.current;

    const added = activeTokens.filter(
      (t) => !prevActive.some((p) => p.uuid === t.uuid)
    );

    const removed = prevActive.filter(
      (t) => !activeTokens.some((p) => p.uuid === t.uuid)
    );

    added.forEach((t) => send({ type: "token_update", action: "add", token: t }));
    removed.forEach((t) => send({ type: "token_update", action: "remove", token: t }));

    prevActiveRef.current = activeTokens;
  }, [activeTokens, send]);

  useEffect(() => {
    send({ type: "request_init"});
  }, [])

  const menuItems = [
    role === "mj" && (
      <MapSelector
        key="map"
        role={role}
        maps={maps}
        selectedMap={selectedMap}
        changeMap={changeMap}
      />
    ),
    role === "mj" && (
      <IllustrationSelector
        key="illustration"
        role={role}
        illustrations={illustrations}
        selectedIllustration={selectedIllustration}
        changeIllustration={changeIllustration}
      />
    ),
    role === "mj" && (
      <TokenSelector
        key="token"
        role={role}
        tokens={tokens}
        activeTokens={activeTokens}
        toggleToken={ToggleToken}
      />
    ),
    <DiceMenu
      key="dice"
      dices={[4,6,10,12,20,50,100]}
      countDices={dice.countDices}
      setCountDices={dice.setCountDices}
      rollDices={rollDices}
    />,

    <button
        className="btn btn-ghost"
        onClick={() => send({ type: "request_init"})}
    >
        <RefreshCcw/>
    </button>

  ].filter(Boolean);

  return (

    <div className="min-h-screen flex mx-auto max-w-screen-2xl px-[5vw] gap-[5vw]">
        <div className="w-1/3 bg-base-200 rounded-2xl">
            {activePlayers && activePlayers.map((player, index) => 
                <CharacterCard
                    key={index}
                    player={player}
                />
            )}
        </div>

        <div className="w-2/3 flex flex-col gap-4">
            <div className="bg-base-300 w-full p-2 rounded-2xl shadow-2xl">
                <ul className="flex items-center justify-center gap-6">
                    {menuItems.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
            </div>

            <div className="flex-1 min-h-0">
                <MapDisplay
                    role={role}
                    apiURL={apiURL}
                    selectedMap={selectedMap}
                    campaignId={campaignId!}
                    selectedIllustration={selectedIllustration}
                    activeTokens={activeTokens}
                    send={send}
                    diceUI={<DiceResults {...dice} />}
                />
            </div>
        </div>
    </div>
  );
};

export default Table;