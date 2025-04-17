
'use client';

import React from 'react';
import { useLocale } from '@/lib/context/LocaleContext';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Vietnam', value: 'vi' },
  { label: 'Français', value: 'fr' },
];

const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useLocale();

  return (
    <select value={currentLanguage} onChange={(e) => setLanguage(e.target.value)}>
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
