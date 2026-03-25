import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import i18n from "../i18n"

type Language = "fr" | "en"

const LanguageContext = createContext<{
    lang: Language;
    setLang: (lang: Language) => void;
}>({
    lang: "fr",
    setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode}) {
    const [lang, setLangState] = useState<Language>(() => {
        const stored = localStorage.getItem("lang");
        return stored === "fr" || stored === "en" ? stored : "fr";
    });

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        i18n.changeLanguage(newLang);
        localStorage.setItem("lang", newLang)
    };

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, []);
    
    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)