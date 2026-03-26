import { useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LangSwitcher";
import Footer from "../components/Footer";
import { NavbarTransition } from "../components/Transitions";

import logo from "../assets/logo.webp"
import { Crown, Dice5 } from "lucide-react";
import BackgroundDice from "../components/BackgroundDice";

export default function RoleSelection() {
    const { setRole } = useRole()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const chooseRole = (role: "mj" | "player") => {
        setRole(role)
        navigate("/room/table")
    }

    return (
        <div className="min-h-screen flex flex-col">
            <NavbarTransition>
                <BackgroundDice />
                <div className="flex-1 flex flex-col items-center">
                    <img src={ logo } alt="OpenTableTop Logo" className="w-70 h-70 mt-15"/>

                    <p className="text-4xl font-bold text-center">
                        {t("global.app-title")}
                    </p>
                    <p className="text text-sm text-center p-1">
                        {t("global.app-subtitle")}
                    </p>

                    <div className="w-2/3 flex flex-col gap-4 my-10 bg-base-200 p-5 rounded-2xl shadow-xl">

                        <div className="flex justify-center">
                            <p className="text-md text-center">{t("page.login.role-div.caption")}</p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
                            <button 
                                className="btn flex-1 btn-secondary btn-soft items-center shadow-md p-2"
                                onClick={ () => chooseRole("player")}
                            >
                                <Dice5 className="w-5 h-5" />
                                <span>{t("page.login.role.player")}</span>
                            </button>
                            
                            <button 
                                className="btn flex-1 btn-secondary btn-soft items-center shadow-md p-2"
                                onClick={ () => chooseRole("mj") }
                            >
                                <Crown className="w-5 h-5"/>
                                <span>{t("page.login.role.game-master")}</span>
                            </button>
                        </div>

                    </div>

                    <div className="mb-10">
                        <LanguageSwitcher />
                    </div>
                </div>
            </NavbarTransition>

            <Footer />
        </div>
    )
}