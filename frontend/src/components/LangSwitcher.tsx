// src/components/LangSwitcher.tsx
import { useLanguage } from "../context/LanguageContext";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { t } = useTranslation();
  const { lang, setLang } = useLanguage();

  return (
    <div>
      <label className="select select-sm">
        <span className="label">
          <Languages className="h-4 w-4" />
        </span>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as "fr" | "en")}
        >
          <option value="en">🇬🇧 {t("selector.lang.en")}</option>
          <option value="fr">🇫🇷 {t("selector.lang.fr")}</option>
        </select>
      </label>
    </div>
  );
}

export default LanguageSwitcher;