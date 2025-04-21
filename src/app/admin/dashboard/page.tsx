"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdOutlineBarChart,
} from "react-icons/md";
import ProfilePopOver from "../../components/ProfilePopOver";
import { TbNotes } from "react-icons/tb";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/context/AuthContext";

export default function Dashboard() {
  const navbarItem = [
    {
      label: "Thống kê",
      icon: MdOutlineBarChart,
      href:'user/statistic'
    },
    {
      label: "Lớp học của tôi",
      icon: TbNotes ,
      href:'online/my-class'
    },
  ];

  const {tokenInfo} = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!tokenInfo || tokenInfo?.role !== "admin") {
  //     console.log("Not user");
      
  //     router.replace("unauthorizer");
  //   }
  // }, [tokenInfo]);

  return (
    <div className="flex @container bg-white min-h-screen text-black">
      <aside className="w-64 bg-white shadow-md p-4">
        <nav className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-center justify-center">
            <Image
              src="/engventure-logo.svg"
              width={60}
              height={60}
              alt="Logo"
            />
            <span className="text-xl font-bold text-amber-500">EngVenture</span>
          </div>
          <Link href="/my-course" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/my-course" className="hover:text-blue-600">
            My Courses
          </Link>
          <Link href="/dashboard/settings" className="hover:text-blue-600">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <div className="text-lg font-semibold">Welcome 👋</div>
          <div className="text-sm text-gray-600">user@example.com</div>
          {/* <div
            className="flex flex-row left-auto items-center"
            onClick={() => setIsShowProfile(!isShowProfile)}
          >
            <Image src="/happy_boy.svg" width={48} height={48} alt="Logo" />
            {!isShowProfile ? <MdArrowDropDown /> : <MdArrowDropUp />}
          </div> */}
          <ProfilePopOver />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6"></main>
      </div>
    </div>
  );
}
