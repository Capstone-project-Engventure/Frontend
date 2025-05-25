'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

const locales = ['en', 'vi'];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <select onChange={handleChange} value={currentLocale} disabled={isPending}>
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale === 'en' ? 'English' : 'Tiếng Việt'}
        </option>
      ))}
    </select>
  );
}
