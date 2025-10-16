import { useEffect, useState, createContext, useContext } from "react";

type language = "EN" | "PT";

type LanguageContextProviderProps = {
  children: React.ReactNode;
};

type LanguageContextType = {
  language: language;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export default function LanguageContextProvider({
  children,
}: LanguageContextProviderProps) {
  const [language, setLanguage] = useState<language>("EN");

  const toggleLanguage = () => {
    if (language === "EN") {
      setLanguage("PT");
      window.localStorage.setItem("language", "PT");
      document.documentElement.classList.add("PT");
    } else {
      setLanguage("EN");
      window.localStorage.setItem("language", "EN");
      document.documentElement.classList.remove("PT");
    }
  };

  useEffect(() => {
    const localLanguage = window.localStorage.getItem(
      "language"
    ) as language | null;

    if (localLanguage) {
      setLanguage(localLanguage);

      if (localLanguage === "PT") {
        document.documentElement.classList.add("PT");
      }
    } else if (window.matchMedia("(prefers-color-scheme: PT)").matches) {
      setLanguage("PT");
      document.documentElement.classList.add("PT");
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context === null) {
    throw new Error(
      "useLanguage must be used within a LanguageContextProvider"
    );
  }

  return context;
}
