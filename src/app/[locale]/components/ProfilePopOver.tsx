"use client";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import Link from "next/link";
import { useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import Image from "next/image";
import { MdArrowDropDown, MdArrowDropUp, MdLogout } from "react-icons/md";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import OAuthService from "@/lib/services/oauth.service";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "next-intl";
export default function ProfilePopOVer() {
  const router = useRouter();
  const oauthService = new OAuthService();
  // const { reset } = useAuth();
  const locale = useLocale();
  const items = [
    {
      label: "Thông tin cá nhân",
      icon: HiUserCircle,
      href: `/${locale}/student/user-profile`,
    },
    {
      label: "Cài đặt",
      icon: HiUserCircle,
      href: `/${locale}/settings`,
    },
    {
      label: "Đóng góp ý kiến",
      icon: HiUserCircle,
      href: `/${locale}/settings`,
    },
    // {
    //   label: "Đăng xuất",
    //   icon: HiUserCircle,
    //   href: "/logout",
    // },
  ];
  const [isShowProfile, setIsShowProfile] = useState(false);
  const handleLogout = async () => {
    await oauthService.logout();
    localStorage.removeItem("user");
    router.push("/");
    toast.info("Đăng xuất thành công");
  };

  return (
    <div>
      <Popover className="relative text-black items-center">
        <PopoverButton>
          <div
            className="flex flex-row gap-2 items-center"
            onClick={() => setIsShowProfile(!isShowProfile)}
          >
            <Image src="/happy_boy.svg" width={48} height={48} alt="Logo" />
            {!isShowProfile ? <MdArrowDropDown /> : <MdArrowDropUp />}
          </div>
        </PopoverButton>
        <Transition>
          <PopoverPanel
            transition
            anchor="bottom"
            className="divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 relative shadow-xl transition duration-200 ease-out"
          >
            <div className="p-3">
              <ul className="gap-2 min-h-full">
                {items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index} className="block transition">
                      <Link
                        href={item.href}
                        className="grid grid-cols-4 items-center gap-2 px-3 py-2 rounded-md bg-white hover:bg-blue-500 hover:text-white transition-colors duration-300"
                      >
                        <span className="text-black col-span-3">
                          {item.label}
                        </span>
                        <Icon className="w-6 h-6 col-span-1 text-black" />
                      </Link>
                    </li>
                  );
                })}
                <li className="block transition">
                  <Link
                    href="#"
                    type="button"
                    className="grid grid-cols-4 px-3 py-2 rounded-md gap-2 bg-white items-center hover:bg-blue-500 hover:text-white transition-colors"
                    onClick={handleLogout}
                  >
                    <span className="text-black col-span-3">Đăng xuất</span>
                    <MdLogout className="w-6 h-6 col-span-1 text-black" />
                  </Link>
                </li>
              </ul>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  );
}
