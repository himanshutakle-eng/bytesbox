import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: (Localization.getLocales?.()[0]?.languageCode as string) || "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
