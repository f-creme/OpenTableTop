import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface DiceContextType {
  diceResults: number[];
  setDiceResults: (r: number[]) => void;
  selectedDice: number;
  setSelectedDice: (d: number) => void;
  countDices: number;
  setCountDices: (c: number) => void;
}

export const DiceContext = createContext<DiceContextType | null>(null);

export const DiceProvider = ({ children }: { children: ReactNode }) => {
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [selectedDice, setSelectedDice] = useState<number>(1);
  const [countDices, setCountDices] = useState<number>(1);

  return (
    <DiceContext.Provider value={{ diceResults, setDiceResults, selectedDice, setSelectedDice, countDices, setCountDices }}>
      {children}
    </DiceContext.Provider>
  );
};