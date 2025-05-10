"use client";
import ProfilePopOver from "@/app/components/ProfilePopOver";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useEffect, useContext, useState } from "react";
import ThemeChanger from "../themeSelector";
export default function Header() {
  // const { user } = useAuth();
  const tokenInfo = localStorage.getItem("tokenInfo") || null;
  const user = localStorage.getItem("user") || null;

  const [isAdmin, setIsAdmin] = useState(false);
  if (tokenInfo) {
    const jsonTokenInfo = JSON.parse(tokenInfo);
    if (jsonTokenInfo.role == "admin") setIsAdmin(true);
  }

  useEffect(() => {
    if (user) {
      const userData = JSON.parse(user);
      console.log("userData:", userData);
      const isSuperAdmin = userData.roles.some(
        (role) => role.name === "Super Administrator"
      );
      setIsAdmin(isSuperAdmin);
      // for (let role of userData.roles) {
      //   if (role.name == "Super Administrator") {
      //     setIsAdmin(true);
      //     break;
      //   }
      // }
    }
  }, []);
  return (
    <header className="h-16 bg-white shadow-xl flex flex-row items-center px-6 justify-between">
      <div className="text-lg font-semibold flex flex-row">
        Welcome 👋{" "}
        {isAdmin && <Link href="/admin/dashboard">Admin Dashboard</Link>}
      </div>
      <div className="flex flex-row items-center">
        <div className="m-2">
          <ThemeChanger />
          {/* <LayoutAnimation/> */}
        </div>
        <div className="text-sm text-gray-600">{user?.email || "Guest"}</div>
        <div className="items-center">
          <ProfilePopOver />
        </div>
      </div>
    </header>
  );
}
