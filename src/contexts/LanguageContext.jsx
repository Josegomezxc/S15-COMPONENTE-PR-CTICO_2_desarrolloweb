import { createContext, useContext, useState, useCallback } from 'react';
import es from '../i18n/es';
import en from '../i18n/en';

const locales = { es, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const stored = localStorage.getItem('prostore-lang');
  const initialLang = stored === 'en' || stored === 'es' ? stored : 'es';
  const [lang, setLang] = useState(initialLang);

  const t = useCallback((key, params = {}) => {
    const text = locales[lang][key] || key;
    if (!params || Object.keys(params).length === 0) return text;
    return text.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
  }, [lang]);

  const changeLang = useCallback((l) => {
    setLang(l);
    localStorage.setItem('prostore-lang', l);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
