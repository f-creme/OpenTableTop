// components/Footer.tsx

import { Scale } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    const GitHubIcon = ({ className = "" }) => (
        <svg
            className={ className }
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            ></path>
        </svg>
    );

    return (
        <footer className="relative mt-auto">
            <div className="h-px bg-linear-to-r from-transparent via-(--color-secondary) to-transparent"></div>
            <div className="bg-linear-to-r from-transparent via-(--color-base-100) to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                        
                        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start text-xs text-base-content/50">
                            <a 
                                href="/legal/terms-of-use.pdf" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:text-secondary transition-colors duration-300 font-medium"
                            >
                                {t("component.footer.terms")}
                            </a>
                            <span className="w-1 h-1 rounded-full bg-base-content/50"></span>
                            <a 
                                href="/legal/privacy.pdf" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:text-secondary transition-colors duration-300 font-medium"
                            >
                                {t("component.footer.privacy")}
                            </a>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                            <span className="text-xs text-base-content/50">© 2026 Florentin Creme</span>
                            <span className="w-1 h-1 rounded-full bg-base-content/50 hidden sm:block"></span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/50"><Scale className="h-3 w-3"/></span>
                                <span className="text-xs text-base-content/50">GNU GPL v3.0</span>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-base-content/50 hidden sm:block"></span>
                            <a 
                                className="group flex items-center gap-2 text-base-content/50 hover:text-primary transition-colors duration-300 font-medium"
                                href="https://github.com/f-creme/OpenTableTop"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="hidden sm:inline">GitHub</span>
                                <div className="relative transform rotate-0 transition-transform duration-300 group-hover:rotate-360">
                                    <GitHubIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                                    <div className="absolute inset-0 rounded-full bg-primary opacity-0 blur-md -z-10"></div>
                                </div>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    )
}