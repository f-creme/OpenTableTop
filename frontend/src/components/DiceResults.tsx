// components/DiceResults.tsx

import { useTranslation } from "react-i18next";
import Dice20Icon from "./DiceIcon";

interface DiceResultsProps {
  displayedResults: number[];
  diceResults: number[];
  selectedDice: number;
  countDices: number;
  showSum: boolean;
  showRoll: boolean;
  isClearing: boolean;
  clearResults: () => void;
}

const DiceResults = ({
  displayedResults, diceResults, selectedDice, countDices,
  showSum, showRoll, isClearing, clearResults
}: DiceResultsProps) => {
  const { t } = useTranslation();
  return (
  <>
    {displayedResults.length > 0 && (
      <div className="flex flex-col justify-center items-center gap-4 min-h-20 max-w-4xl mx-auto p-4">
          {showRoll && (
            <p className={`text-lg font-normal ${isClearing ? "animate-[fadeOut_0.3s_ease]" : "animate-[fadeIn_1.0s_ease]"}`}>
              {t("component.dice-results.results")} {countDices}d{selectedDice}:
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {displayedResults.map((value, index) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center
                          bg-primary rounded-xl shadow-lg
                          text-lg font-bold
                          ${isClearing ? "animate-[fadeOut_0.3s_ease]" : "animate-[fadeIn_0.3s_ease]"}`}
              >
                {value}
              </div>
            ))}
            {showSum && (
              <div className={`flex ml-6 text-xl font-bold items-center ${isClearing ? "animate-[fadeOut_0.3s_ease]" : "animate-[fadeIn_1.0s_ease]"}`}>
                <div>=&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div className="relative w-16 h-16">
                  <Dice20Icon className="w-full h-full stroke-0 text-accent" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-base-100/90 text-md px-1 py-1 rounded-full shadow-lg/50">
                      {diceResults.reduce((a, b) => a + b, 0)}
                    </span>
                  </span>
                </div>
                <div>&nbsp;/ {selectedDice * countDices}</div>
              </div>
            )}
            {(displayedResults.length > 0 || showSum) && (
              <button
                onClick={clearResults}
                className="ml-4 btn btn-sm btn-error animate-[fadeIn_0.5s_ease]"
              >
                {t("component.dice-results.clear")}
              </button>
            )}
          </div>
      </div>
    )}
  </>
)};

export default DiceResults;