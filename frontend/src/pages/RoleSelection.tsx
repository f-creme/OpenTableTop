import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRole } from "../context/RoleContext";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LangSwitcher";
import Footer from "../components/Footer";
import { NavbarTransition } from "../components/Transitions";

import logo from "../assets/logo.webp";
import { Crown, Dice5 } from "lucide-react";
import BackgroundDice from "../components/BackgroundDice";
import { getCampaigns } from "../api/services/campaignServices";
import type { Campaign } from "../types/campaign";
import { useCampaign } from "../context/CampaignContext";
import { useProfile } from "../context/ProfileContext";
import { getProfile } from "../api/services/authServices";

export default function RoleSelection() {
    const { setRole } = useRole();
    const { setPublicName } = useProfile();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setCampaignId } = useCampaign();

    const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
    const [selectedCampaign, setSelectedCampaign] = useState<number>(0);
    const [disabledPlayer, setDisabledPlayer] = useState<boolean>(true);
    const [disabledMaster, setDisabledMaster] = useState<boolean>(true);

    const chooseRole = (role: "mj" | "player") => {
        setRole(role);
        if (selectedCampaign < 0) {
            navigate("/room/mj/campaign");
        } else {
            navigate("/room/table");
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                setPublicName(res.publicName);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile()
    }, []);

    // Load campaigns
    useEffect(() => {
        getCampaigns()
            .then((data) => {
                setCampaigns(data);
                if (!data || data.length === 0) {
                    setSelectedCampaign(-1);
                } else {
                    setSelectedCampaign(data[0].id);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    // Update CampaignContext
    useEffect(() => {
        if (selectedCampaign !== 0) {
            setCampaignId(selectedCampaign);
        }
    }, [selectedCampaign]);

    // Enable/disable buttons
    useEffect(() => {
        if (selectedCampaign === -1) {
            setDisabledMaster(false);
            setDisabledPlayer(true);
        } else {
            const selectedCampaignObj = campaigns?.find(c => c.id === selectedCampaign);
            if (selectedCampaignObj?.userRole === "player") {
                setDisabledMaster(true);
                setDisabledPlayer(false);
            } else {
                setDisabledMaster(false);
                setDisabledPlayer(true);
            }
        }
    }, [selectedCampaign, campaigns]);

    return (
        <div className="min-h-screen flex flex-col">
            <NavbarTransition>
                <BackgroundDice />
                <div className="flex-1 flex flex-col items-center">
                    <img src={logo} alt="OpenTableTop Logo" className="w-70 h-70 mt-15" />

                    <p className="text-4xl font-bold text-center">
                        {t("global.app-title")}
                    </p>
                    <p className="text text-sm text-center p-1">
                        {t("global.app-subtitle")}
                    </p>

                    <div className="w-2/3 flex flex-col gap-4 my-10 bg-base-200 p-5 rounded-2xl shadow-xl">

                        <div className="flex justify-center">
                            <p className="text-md text-center">{t("page.role-selection.caption")}</p>
                        </div>

                        <select
                            className="select w-full"
                            value={selectedCampaign}
                            onChange={(e) => setSelectedCampaign(Number(e.target.value))}
                        >
                            <option key={0} disabled value={0}>
                                Sélection de la campagne
                            </option>
                            {campaigns?.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.title}
                                </option>
                            ))}
                            <option key={-1} value={-1}>
                                {t("page.role-selection.selector.campaign.create")}
                            </option>
                        </select>

                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
                            <button
                                className="btn flex-1 btn-secondary btn-soft items-center shadow-md p-2"
                                disabled={disabledPlayer}
                                onClick={() => chooseRole("player")}
                            >
                                <Dice5 className="w-5 h-5" />
                                <span>{t("page.role-selection.role.player")}</span>
                            </button>

                            <button
                                className="btn flex-1 btn-secondary btn-soft items-center shadow-md p-2"
                                disabled={disabledMaster}
                                onClick={() => chooseRole("mj")}
                            >
                                <Crown className="w-5 h-5" />
                                <span>{t("page.role-selection.role.master")}</span>
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
    );
}