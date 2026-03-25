// pages/Table.tsx

import { useState, useEffect, useRef } from "react";
import axios from "axios";

import { useAuth } from "../context/AuthContext"
// import { useTranslation } from "react-i18next";

import DiceMenu from "../components/DiceMenu";
import DiceResults from "../components/DiceResults";
import MapSelector from "../components/MapSelector";
import MapDisplay from "../components/MapDisplay";

const Table = () => {
    // const { t } = useTranslation();
    const { role } = useAuth();

    const apiURL = import.meta.env.VITE_API_URL;
    const api = axios.create({ baseURL: apiURL });

    const dices : number[] = [4, 6, 10, 12, 20, 50, 100];
    const [countDices, setCountDices] = useState<number>(1);
    const [countDiceDisplay, setCountDiceDisplay] = useState<number>(1);
    const [selectedDice, setSelectedDice] = useState<number>(1);
    const [diceResults, setDiceResults] = useState<number[]>([]);
    const [displayedResults, setDisplayedResults] = useState<number[]>([]);
    const [showSum, setShowSum] = useState<boolean>(false);
    const [showRoll, setShowRoll] = useState<boolean>(false);
    const [isClearing, setIsClearing] = useState<boolean>(false);

    const wsRef = useRef<WebSocket | null>(null);
    
    const [maps, setMaps] = useState<string[]>([]);
    const [selectedMap, setSelectedMap] = useState<string | null>(null);

    // WebSocket
    useEffect(() => {
        const ws = new WebSocket(`${apiURL.replace("http", "ws")}/table_ws/ws`);
        wsRef.current = ws;

        ws.onopen = () => console.log("Connected to table WebSocket");
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "map_update") {
                setSelectedMap(data.selected_map)
            };
            if (data.type === "dice_result") {
                console.log("Dice results:", data)
                handleDiceResult(data);
            };
        };
        ws.onclose = () => console.log("Disconnected from table WebSocket");
        ws.onerror = (err) => console.error("WebSocket error:", err);

        return () => ws.close();
    }, []);

    const changeMap = (mapName: string) => {
        wsRef.current?.send(JSON.stringify({ type: "map_change", selected_map: mapName }));
    };

    // Rolling dices
    const rollDices = (die: number) => {
        wsRef.current?.send(
            JSON.stringify({
                type: "dice_roll",
                dice: die,
                count: countDices
            })
        );
    };

    const handleDiceResult = (data: any) => {
        const { dice, results, count } = data;

        setSelectedDice(dice);
        setCountDiceDisplay(count);
        setDiceResults(results);
        setDisplayedResults([]);
        setShowSum(false);
        setShowRoll(false);

        results.forEach((value: number, index: number) => {
            setTimeout(() => {
            setDisplayedResults((prev) => [...prev, value]);

            if (index === results.length - 1) {
                setTimeout(() => setShowSum(true), 300);
                setTimeout(() => setShowRoll(true), 600);
            }
            }, index * 300);
        });
    };

    const clearResults = () => {
        setIsClearing(true);
        setTimeout(() => {
            setDisplayedResults([]);
            setDiceResults([]);
            setShowSum(false);
            setShowRoll(false);
            setIsClearing(false);
        }, 300);
    };


    // Load maps
    useEffect(() => {
        api.get("/maps/")
            .then((res) => {
                setMaps(res.data.maps);
                const savedMap = localStorage.getItem("selectedMap");
                if (savedMap && res.data.maps.includes(savedMap)) setSelectedMap(savedMap);
                else if (res.data.length > 0) setSelectedMap(res.data.maps[0])
            })
            .catch((err) => console.error("Error retrieving maps:", err));
    }, []);

    useEffect(() => {
        if (selectedMap) localStorage.setItem("selectedMap", selectedMap);
    }, [selectedMap])


    // Render
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-col gap-4 flex-1 p-4 items-center">

                {/* TABLE MENU */}
                <div className="bg-base-300 w-2/3 max-w-4xl mx-auto mt-4 p-2 rounded-2xl shadow-2xl relative z-20">
                    <ul className="flex items-center justify-center gap-6">
                        <li><MapSelector role={role} maps={maps} selectedMap={selectedMap} changeMap={changeMap} /></li>
                        <li><DiceMenu dices={dices} countDices={countDices} setCountDices={setCountDices} rollDices={rollDices} /></li>
                    </ul>
                </div>

                {/* DICE ROLL RESULTS */}
                <DiceResults 
                    displayedResults={displayedResults}
                    diceResults={diceResults}
                    selectedDice={selectedDice}
                    countDices={countDiceDisplay}
                    showSum={showSum}
                    showRoll={showRoll}
                    isClearing={isClearing}
                    clearResults={clearResults}
                />

                {/* DISPLAY MAP */}
                <div className="flex-1 flex items-center justify-center min-h-0">
                    <MapDisplay apiURL={apiURL} selectedMap={selectedMap} />
                </div>

            </div>
        </div>
    )
}

export default Table;