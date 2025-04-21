"use client";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import Link from "next/link";
import { Component, useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import Image from "next/image";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

export default function ProfilePopOVer() {
  const items = [
    {
      label: "Thông tin cá nhân",
      icon: HiUserCircle,
      href: "/student/user-profile",
    },
    {
      label: "Cài đặt",
      icon: HiUserCircle,
      href: "/settings",
    },
    {
      label: "Đóng góp ý kiến",
      icon: HiUserCircle,
      href: "/settings",
    },
    {
      label: "Đăng xuất",
      icon: HiUserCircle,
      href: "/logout",
    },
  ];
  const [isShowProfile, setIsShowProfile] = useState(false);
  const toggleProfile = () => {
    setIsShowProfile(!isShowProfile);
  };
  return (
    <div>
      <Popover className="relative text-black">
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
            className="flex flex-col divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition "
          >
            <div className="">
              {items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    href={item.href}
                    className="grid grid-cols-4 px-3 py-2 gap-2 bg-white items-center"
                    key={index}
                  >
                    <span className="text-black col-span-3">{item.label}</span>
                    <Icon className="w-6 h-6 col-span-1 text-black"/>
                  </Link>
                );
              })}
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  );
}
