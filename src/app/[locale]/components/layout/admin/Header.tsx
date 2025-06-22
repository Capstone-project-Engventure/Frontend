"use client";
import ProfilePopOver from "@/app/[locale]/components/ProfilePopOver";
import ThemeChanger from "../../themeSelector";
import LanguageSwitcher from "../../LanguageSelector";
export default function Header() {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Welcome 👋</div>
      <div className="flex flex-row items-center left-auto gap-2">
        <LanguageSwitcher></LanguageSwitcher>
        <ThemeChanger />
        <ProfilePopOver />
      </div>
    </header>
  );
}
