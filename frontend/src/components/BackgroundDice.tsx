import { useEffect, useState } from "react";
import Dice20Icon from "./DiceIcon";

type Dice = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  rotation: number;
  dx: number;
  dy: number;
  depth: "near" | "far";
  color: string;
};

const COLORS = [
  "rgba(212, 175, 55, 0.35)", // doré
  "rgba(192, 192, 192, 0.25)", // argent
  "rgba(223, 173, 199, 0.20)"
];

const NUM_DICES = 9;

export default function BackgroundDice() {
  const [dices, setDices] = useState<Dice[]>([]);

  // 🎲 Génération d’un dé
  const generateDice = (id: number): Dice => {
    const depth = Math.random() > 0.5 ? "near" : "far";

    const size =
      depth === "near"
        ? 80 + Math.random() * 60
        : 40 + Math.random() * 40;

    const margin = 10;

    return {
      id,
      x: margin + Math.random() * (100 - margin * 2),
      y: margin + Math.random() * (100 - margin * 2),
      size,
      duration: 8 + Math.random() * 6,
      rotation: Math.random() * 360 / 2,
      dx: (Math.random() - 0.5) * 200,
      dy: (Math.random() - 0.5) * 200,
      depth,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  };

  // 🔁 Cycle de vie d’un dé (spawn → animation → respawn)
  const spawnDice = (id: number) => {
    const dice = generateDice(id);

    setDices((prev) => {
      const others = prev.filter((d) => d.id !== id);
      return [...others, dice];
    });

    // relance après la durée de l’animation
    setTimeout(() => {
      spawnDice(id);
    }, dice.duration * 1000);
  };

  // 🚀 Initialisation progressive
  useEffect(() => {
    for (let i = 0; i < NUM_DICES; i++) {
      setTimeout(() => spawnDice(i), Math.random() * 4000);
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {dices.map((d) => (
        <div
          key={d.id}
          className="absolute animate-dice-float"
          style={
            {
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: `${d.size}px`,
              height: `${d.size}px`,
              animationDuration: `${d.duration}s`,
              "--dx": `${d.dx}px`,
              "--dy": `${d.dy}px`,
              "--rot": `${d.rotation}deg`,
              filter: d.depth === "near" ? "blur(4px)" : "blur(7px)",
            } as React.CSSProperties
          }
        >
          {/* Wrapper pour couleur + glow */}
          <div
            className="w-full h-full"
            style={{
              color: d.color,
              filter:
                d.depth === "near"
                  ? "drop-shadow(0 0 6px rgba(212,175,55,0.25))"
                  : "none",
            }}
          >
            <Dice20Icon className="w-full h-full" />
          </div>
        </div>
      ))}
    </div>
  );
}