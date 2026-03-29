import { useState } from "react";

export const useDice = () => {
    const [countDices, setCountDices] = useState(1);
    const [countDiceDisplay, setCountDiceDisplay] = useState(1);
    const [selectedDice, setSelectedDice] = useState(1);

    const [diceResults, setDiceResults] = useState<number[]>([]);
    const [displayedResults, setDisplayedResults] = useState<number[]>([]);

    const [showSum, setShowSum] = useState(false);
    const [showRoll, setShowRoll] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

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

    return {
        countDices,
        setCountDices,
        countDiceDisplay,
        selectedDice,
        diceResults,
        displayedResults,
        showSum,
        showRoll,
        isClearing,
        handleDiceResult,
        clearResults
    };
};