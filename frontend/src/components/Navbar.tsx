// components/Navbar.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useRole } from "../context/RoleContext";
import { NavbarTransition } from "./Transitions";

import { LogOut, Menu, Dice3, SquareUserRound, UsersRound } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { role } = useRole();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".mobile-menu") && !target.closest(".mobile-menu-btn")) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <NavbarTransition>
      <div className="flex flex-col items-center">
        <div className="navbar bg-base-200 shadow-xl rounded-2xl my-5 relative z-50 w-9/10">

          {/* Left part */}
          <div className="flex-1">
            <Link className="btn btn-ghost text-xl" to="/room/role-selection">{t("global.app-title")}</Link>
          </div>

          {/* Menu for mobile devices */}
          <div className="flex-none lg:hidden">
            <button
              className="btn btn-ghost mobile-menu-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              <Menu className="h-5 w-5 stroke-3"/>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="flex-none hidden lg:flex gap-2">

            <Link className="btn btn-ghost text-md" to="/room/table">
              {t("component.navbar.table")}
            </Link>

            {role === "mj" && (
            <>
                <Link className="btn btn-ghost text-md" to="/room/mj/campaign">
                  {t("component.navbar.campaign")}
                </Link>
              </>
            )}

            {role === "player" && (
              <>
                <Link className="btn btn-ghost text-md" to="/room/player/character-sheet">
                  {t("component.navbar.character-sheet")}
                </Link>
              </>
            )}

            <Link className="btn btn-ghost" to="/">
              <LogOut className="h-5 w-5"/>
            </Link>

          </div>

          {/* Portal Menu Mobile */}
          {mobileMenuOpen && createPortal(
            <ul className="mobile-menu menu menu-sm fixed z-50 top-20 right-4 p-2 shadow shadow-accent bg-base-100 rounded-box w-52 flex flex-col gap-2">
              <li className="font-medium"><Link to="/room/table"><Dice3 className="h-4 w-4 stroke-2" /> {t("component.navbar.table")}</Link></li>

              {role === "mj" && (
                <>
                  <li className="font-medium"><Link to="/room/mj/campaign"><UsersRound className="h-4 w-4 stroke-2" /> {t("component.navbar.campaign")}</Link></li>
                </>
              )}

              {role === "player" && (
                <>
                  <li className="font-medium"><Link to="/room/player/character-sheet"><SquareUserRound className="h-4 w-4 stroke-2" /> {t("component.navbar.character-sheet")}</Link></li>
                </>
              )}
              <li className="font-medium"><Link to="/"><LogOut className="h-4 w-4 stroke-2" /> {t("component.navbar.home")} </Link></li>
            </ul>,
            document.body
          )}

        </div>
      </div>
    </NavbarTransition>
  );
}