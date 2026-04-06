// components/DiceMenu.tsx

import { useState, useRef, useEffect } from "react";
import { Dice3 } from "lucide-react";
import Dice20Icon from "./DiceIcon";
import { useTranslation } from "react-i18next";

interface DiceMenuProps {
  dices: number[];
  countDices: number;
  setCountDices: (n: number) => void;
  rollDices: (die: number) => void;
}
 
const DiceMenu = ({
  dices,
  countDices,
  setCountDices,
  rollDices,
}: DiceMenuProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [shaking, setShaking] = useState(false)

  // Close on click outsise
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="btn btn-ghost bg-transparent transform transition-transform duration-300 hover:rotate-20"
      >
        <Dice20Icon 
          className={`w-7 h-7 stroke-5 ${shaking ? "animate-shake" : ""}`}
        />
      </button>

      {/* Menu */}
      {open && (
        <div className={`absolute z-999 mt-2 w-44 bg-base-100 rounded-xl shadow shadow-secondary p-2 flex flex-col gap-2`} style={{ isolation: "isolate"}}>
          
          {/* Number of dice */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t("component.dice-menu.number")}</legend>
            <input
              className="input input-secondary w-full"
              type="number"
              min={1}
              max={10}
              value={countDices}
              onChange={(e) => {
                if (Number(e.target.value) < 11) {
                  setCountDices(Number(e.target.value))
                } else {
                  setCountDices(Number("10"))
                }
                
              }}
            />
          </fieldset>

          {/* Type of dice */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t("component.dice-menu.type")}</legend>
            {dices.map((die) => (
              <button
                key={die}
                className="btn btn-secondary w-full"
                onClick={() => {
                  setShaking(true);
                  setTimeout(() => setShaking(false), 500)
                  rollDices(die);
                  setTimeout(() => setShaking(true), countDices * 300 + 1000);
                  setTimeout(() => setShaking(false), countDices * 300 + 1500);
                  setOpen(false);
                }}
              >
                <Dice3 /> D{die}
              </button>
            ))}
          </fieldset>

        </div>
      )}
    </div>
  );
};

export default DiceMenu;