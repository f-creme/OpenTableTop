// components/TokenSelector.tsx
import { ChessPawn } from "lucide-react";
import type { Token } from "../types/token";

type Role = "mj" | "player" | null;

interface IllusSelectorProps {
    role: Role;
    tokens: Token[];
    activeTokens: Token[];
    toggleToken: (b: boolean, token: Token) => void;
}

const TokenSelector = ({
    role,
    tokens,
    activeTokens,
    toggleToken
}: IllusSelectorProps) => {
    if (role !== "mj") return null;

    return (
        <div className="dropdown dropdown-center">
            <div tabIndex={0} role="button" className="btn btn-ghost">
                <ChessPawn className="h-7 w-7"/>
            </div>

        {tokens.length > 0 ? (
            <ul tabIndex={-1} className="dropdown-content z-1 menu bg-base-100 rounded-box w-60 shadow shadow-info gap-1">
            <li className="menu-title">Select tokens to display</li>
            {tokens.map((token, index) => (
                <li key={index}>
                    <div className="flex gap-4">
                        <input
                            type="checkbox"
                            className="toggle toggle-primary toggle-xs"
                            checked={activeTokens.some((t) => t.id === token.id)}
                            onChange={(e) => toggleToken(Boolean(e.target.checked), token)}
                        />
                        {token.id.split(".")[0]}
                    </div>
                </li>
            ))}
            </ul>
        ) : (
            <ul tabIndex={-1} className="dropdown-content z-1 bg-base-200 rounded-box w-60 menu shadow shadow-info">
            <li className="menu-title">Select tokens to display</li>
            <li>No tokens available for the current campaign</li>
            </ul>
        )}
        </div>
    );
};

export default TokenSelector;