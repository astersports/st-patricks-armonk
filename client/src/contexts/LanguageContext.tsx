/**
 * LanguageContext — lightweight i18n for English/Spanish toggle.
 * Stores preference in localStorage. Only key public-facing strings are translated.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Language = "en" | "es";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

/**
 * Spanish translations for key public-facing strings.
 * Covers navigation, Mass Times, and essential UI elements.
 */
const translations: Record<string, Record<string, string>> = {
  // Navigation
  "nav.home": { es: "Inicio" },
  "nav.about": { es: "Acerca de" },
  "nav.mass_times": { es: "Horarios de Misa" },
  "nav.sacraments": { es: "Sacramentos" },
  "nav.faith_formation": { es: "Formación en la Fe" },
  "nav.events": { es: "Eventos" },
  "nav.giving": { es: "Donaciones" },
  "nav.contact": { es: "Contacto" },
  "nav.new_here": { es: "¿Nuevo Aquí?" },
  "nav.bulletins": { es: "Boletines" },
  "nav.ministries": { es: "Ministerios" },
  "nav.serve": { es: "Servir" },

  // Hero Section
  "hero.welcome": { es: "Bienvenidos a" },
  "hero.subtitle": { es: "Una comunidad católica vibrante en el corazón de Armonk, NY" },
  "hero.next_mass": { es: "Próxima Misa" },
  "hero.view_all_times": { es: "Ver Todos los Horarios" },

  // Mass Times page
  "mass.title": { es: "Horarios de Misa y Confesión" },
  "mass.description": { es: "Únase a nosotros para la celebración de la Eucaristía" },
  "mass.sunday": { es: "Domingo" },
  "mass.saturday": { es: "Sábado" },
  "mass.weekday": { es: "Entre Semana" },
  "mass.confession": { es: "Confesión" },
  "mass.holy_days": { es: "Días de Precepto" },

  // Common
  "common.welcome": { es: "Bienvenidos" },
  "common.learn_more": { es: "Más Información" },
  "common.read_more": { es: "Leer Más" },
  "common.back": { es: "Volver" },
  "common.submit": { es: "Enviar" },
  "common.cancel": { es: "Cancelar" },
  "common.loading": { es: "Cargando..." },
  "common.phone": { es: "Teléfono" },
  "common.email": { es: "Correo Electrónico" },
  "common.address": { es: "Dirección" },
  "common.office_hours": { es: "Horario de Oficina" },

  // Contact page
  "contact.title": { es: "Contáctenos" },
  "contact.description": { es: "Estamos aquí para ayudarle" },
  "contact.parish_office": { es: "Oficina Parroquial" },

  // Giving page
  "giving.title": { es: "Donaciones" },
  "giving.description": { es: "Su generosidad sostiene nuestra parroquia" },
  "giving.one_time": { es: "Una Vez" },
  "giving.recurring": { es: "Recurrente" },

  // Days of week
  "day.sunday": { es: "Domingo" },
  "day.monday": { es: "Lunes" },
  "day.tuesday": { es: "Martes" },
  "day.wednesday": { es: "Miércoles" },
  "day.thursday": { es: "Jueves" },
  "day.friday": { es: "Viernes" },
  "day.saturday": { es: "Sábado" },

  // Footer
  "footer.parish_office": { es: "Oficina Parroquial" },
  "footer.quick_links": { es: "Enlaces Rápidos" },
  "footer.connect": { es: "Conéctese" },
  "footer.copyright": { es: "Todos los derechos reservados" },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem("stpats-lang");
      return (stored === "es" ? "es" : "en") as Language;
    } catch {
      return "en";
    }
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try { localStorage.setItem("stpats-lang", newLang); } catch {}
  }, []);

  const t = useCallback((key: string): string => {
    if (lang === "en") return key; // In English, just return the key (caller uses English as default)
    return translations[key]?.es || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
