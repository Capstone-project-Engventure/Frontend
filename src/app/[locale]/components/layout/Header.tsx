"use client";
import ProfilePopOver from "@/app/[locale]/components/ProfilePopOver";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useEffect, useContext, useState } from "react";
import ThemeChanger from "../themeSelector";
import { Popover } from "@headlessui/react";
import { FaFire } from "react-icons/fa6";
import Cookies from "js-cookie";
import OauthService from "@/lib/services/oauth.service";

type Level = {
  id: string;
  name: string;
  description: string;
};

const levels: Level[] = [
  { id: "a1", name: "A1", description: "Elementary" },
  { id: "a2", name: "A2", description: "Pre-Intermediate" },
  { id: "b1", name: "B1", description: "Intermediate" },
  { id: "b2", name: "B2", description: "Upper-Intermediate" },
  { id: "c1", name: "C1", description: "Advanced" },
];

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/student/grammar", label: "Ngữ pháp" },
  { href: "/student/listen", label: "Nghe" },
  { href: "/student/read", label: "Đọc" },
  { href: "/student/speak", label: "Nói" },
  { href: "/student/write", label: "Viết" },
  { href: "/student/vocabulary", label: "Từ vựng" },
];

type User = {
  email: string;
  roles: Array<{ name: string }>;
  streak: number;
};

export default function Header() {
  const accessToken = Cookies.get("access_token") || null;
  const userStr = Cookies.get("user") || null;
  const oauthService = new OauthService();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User>();
  useEffect(() => {
    async function getUserInfo() {
      if (accessToken) {
        try {
          const userInfo = await oauthService.getUserInfo();
          console.log("user info:", userInfo);
          setUser(userInfo)
        } catch (err) {
          console.error("Invalid tokenInfo cookie:", err);
        }
      }
    }

    getUserInfo();

    // if (userStr) {
    //   try {
    //     const user: User = JSON.parse(userStr);
    //     const isSuperAdmin = user.roles?.some(
    //       (role) => role.name === "Super Administrator"
    //     );
    //     setIsAdmin(isSuperAdmin);
    //   } catch (err) {
    //     console.error("Invalid user cookie:", err);
    //   }
    // }
  }, []);

  return (
    <header className="py-2 px-6 bg-white shadow-xl flex flex-row items-center justify-end">
      {/* <div className="text-lg font-semibold flex flex-row justify-center space-x-8">
        {navItems.map((item) => (
          <Popover key={item.href} className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={`
                    flex items-center text-2xl font-bold
                    ${open ? "text-indigo-600" : "text-gray-900"}
                  `}
                >
                  {item.label}
                </Popover.Button>

                <Popover.Panel className="absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {levels.map((level) => (
                      <Link
                        key={level.id}
                        href={`${item.href}?level=${level.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <span className="font-medium">{level.name}</span>
                        <span className="ml-2 text-gray-500">
                          {level.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </Popover.Panel>
              </>
            )}
          </Popover>
        ))}
      </div> */}
      <div className="flex flex-row items-center">
        <div
          className="flex flex-row gap-2 items-center mr-4"
          onTouchMove={() => {
            alert("hehe");
          }}
        >
          <FaFire className="text-amber-700 bg-white w-8 h-8" />
          <span className="text-base font-semibold">
            {user?.streak || "1"}{" "}
          </span>
        </div>
        <div className="m-2">
          <ThemeChanger />
        </div>
        {/* <div className="text-sm text-gray-600">
          {user?.email || "Guest"}
        </div> */}
        <div className="items-center">
          <ProfilePopOver />
        </div>
      </div>
    </header>
  );
}
