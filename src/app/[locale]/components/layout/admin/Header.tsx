"use client";
import ProfilePopOver from "@/app/[locale]/components/ProfilePopOver";
import ThemeChanger from "../../themeSelector";
import LanguageSwitcher from "../../LanguageSelector";
export default function Header() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <div className="text-lg font-semibold">Welcome 👋</div>
      <div className="flex flex-row items-center left-auto gap-2">
        <LanguageSwitcher></LanguageSwitcher>
        <ThemeChanger />
        <ProfilePopOver />
      </div>
    </header>
  );
}
