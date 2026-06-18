/**
 * LanguageToggle — compact EN/ES switch for the navigation bar.
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "es" : "en")}
      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                 text-muted-foreground hover:text-foreground hover:bg-muted/50
                 transition-colors duration-150"
      aria-label={lang === "en" ? "Cambiar a Español" : "Switch to English"}
      title={lang === "en" ? "Español" : "English"}
    >
      <Globe className="w-3.5 h-3.5" />
      <span className="uppercase">{lang === "en" ? "ES" : "EN"}</span>
    </button>
  );
}
