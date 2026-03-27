// pages/Login.tsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"
import { NavbarTransition } from "../components/Transitions";
import BackgroundDice from "../components/BackgroundDice";
import Footer from "../components/Footer";
import logo from "../assets/logo.webp"
import { useTranslation } from "react-i18next";
import { KeyRound, User } from "lucide-react";
import LanguageSwitcher from "../components/LangSwitcher"

const Login = () => {
    const { login } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [disabledConnect, setDisabledConnect] = useState<boolean>(false)

    const handleLogin = async () => {
        setError("");
        setDisabledConnect(true);
        try {
            const res = await axiosInstance.post("/auth/login", {
                username, 
                password,
            });

            login(res.data.access_token);
            navigate("/room");
        } catch (err: any) {
            setTimeout(() => setDisabledConnect(false), 1000)
            if (err.response && err.response.status === 401) {
                setError(t("page.login.error-credentials"));
            } else {
                setError(t("page.login.error-server"));
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavbarTransition>
                <BackgroundDice />
                <div className="flex-1 flex flex-col items-center">
                    <img src={ logo } alt="OpenTableTop Logo" className="w-70 h-70 mt-15"/>

                    <p className="text-4xl font-bold text-center">
                        {t("global.app-title")}
                    </p>
                    <p className="text text-sm text-center font-medium p-1">
                        {t("global.app-subtitle")}
                    </p>

                    <div className="w-2/3 flex flex-col items-center my-10 bg-base-300 p-7 rounded-2xl shadow-xl">

                        <p className="text-md text-center text-base-content mb-7 font-semibold text-md"> {t("page.login.title")} </p>
                        <label className="input validator"> 
                            <User />
                            <input 
                                className="input"
                                required
                                minLength={5}
                                maxLength={20}
                                placeholder={t("page.login.username")}
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>
                        <p className="validator-hint">
                            {t("page.login.username-validation")}
                        </p>

                        <label className="input validator"> 
                            <KeyRound />
                            <input 
                                type="password"
                                className="password"
                                required
                                minLength={0}
                                maxLength={20}
                                placeholder={`${t("page.login.password")}`} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <p className="validator-hint mb-5">
                            {t("page.login.password-validation")}
                        </p>

                        <button 
                            className="btn btn-primary"
                            onClick={handleLogin}
                            disabled={disabledConnect}
                        >
                            {t("page.login.connect-btn")}
                        </button>
                        
                        {error && <p className="text-sm font-medium text-error-content"><br/>{error}</p>}
                    </div>

                    <div className="mb-10">
                        <LanguageSwitcher />
                    </div>        
                </div>
            <Footer />
            </NavbarTransition>
        </div>
    );
};

export default Login;