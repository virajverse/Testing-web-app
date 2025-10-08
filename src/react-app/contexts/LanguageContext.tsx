import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.whatsapp': 'WhatsApp',
    'header.install': 'Install App',
    // Hero
    'hero.tagline': 'Digital Services, Delivered Like Products.',
    'hero.subtitle': 'Get professional websites, mobile apps, digital marketing, and branding services with just a WhatsApp message.',
    'hero.installApp': 'Install App',
    'hero.installSubtext': 'One click install - Works offline, faster access',
    // Categories
    'categories.all': 'All Services',
    'categories.websites': 'Websites',
    'categories.mobile-apps': 'Mobile Apps',
    'categories.digital-marketing': 'Digital Marketing',
    'categories.branding': 'Branding',
    // Service Card
    'service.days': 'Days',
    'service.order': 'Order on WhatsApp',
    // Service Modal
    'service.features': 'Key Features',
    'service.close': 'Close',
    // General
    'currency': '₹'
  },
  hi: {
    // Header
    'header.whatsapp': 'व्हाट्सऐप',
    'header.install': 'ऐप इंस्टॉल करें',
    // Hero
    'hero.tagline': 'डिजिटल सेवाएं, प्रोडक्ट्स की तरह डिलीवर।',
    'hero.subtitle': 'सिर्फ एक व्हाट्सऐप मैसेज के साथ प्रोफेशनल वेबसाइट्स, मोबाइल ऐप्स, डिजिटल मार्केटिंग, और ब्रांडिंग सेवाएं पाएं।',
    'hero.installApp': 'ऐप इंस्टॉल करें',
    'hero.installSubtext': 'एक क्लिक में इंस्टॉल - ऑफलाइन काम करता है, तेज़ एक्सेस',
    // Categories
    'categories.all': 'सभी सेवाएं',
    'categories.websites': 'वेबसाइट्स',
    'categories.mobile-apps': 'मोबाइल ऐप्स',
    'categories.digital-marketing': 'डिजिटल मार्केटिंग',
    'categories.branding': 'ब्रांडिंग',
    // Service Card
    'service.days': 'दिन',
    'service.order': 'व्हाट्सऐप पर ऑर्डर करें',
    // Service Modal
    'service.features': 'मुख्य विशेषताएं',
    'service.close': 'बंद करें',
    // General
    'currency': '₹'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
