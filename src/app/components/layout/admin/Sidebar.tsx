"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdArrowBackIosNew,
  MdArrowForwardIos,
  MdOutlineBarChart,
} from "react-icons/md";
import { TbNotes } from "react-icons/tb";
export default function Sidebar() {
  const [toggleSidebar,setToggleSidebar] = useState(false);
  const mainNavItems = [
    {
      label: "Thống kê",
      icon: MdOutlineBarChart,
      href: "/admin/dashboard",
    },
    {
      label: "Danh sách khóa học",
      icon: TbNotes,
      href: "/admin/courses",
    },
  ];

  const learnNavItems = [
    {
      label: "Danh sách buổi học",
      icon: MdOutlineBarChart,
      href: "/admin/lessons",
    },
    {
      label: "Danh sách chủ đề",
      icon: TbNotes,
      href: "/admin/topics",
    },
    {
      label: "Danh sách bài học",
      icon: TbNotes,
      href: "/admin/exercises",
    },
    {
      label: "Flashcard",
      icon: TbNotes,
      href: "/admin/flashcard",
    },
     {
      label: "Ghi chú",
      icon: TbNotes,
      href: "/admin/my-note",
    },
  ];

  return (
    <div>
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

            <button type="button" className="p-2 bg-gray-200 text-black rounded-md" onClick={()=>setToggleSidebar((prev)=>!prev)}>
              {toggleSidebar? <MdArrowForwardIos />: <MdArrowBackIosNew />}
              </button>
            

          </div>
          <div className="min-h-screen">
            {mainNavItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div className="px-3 py-2" key={index}>
                  <Link
                    href={item.href}
                    className="grid grid-cols-3 hover:text-blue-600 justify-between"
                  >
                    <Icon className="w-6 h-6 col-span-1 text-black" />
                    <span className="col-span-2">{item.label}</span>
                  </Link>
                </div>
              );
            })}
            <p className="font-bold">Góc học tập</p>
            {learnNavItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div className="px-3 py-2" key={index}>
                  <Link
                    href={item.href}
                    className="grid grid-cols-3 hover:text-blue-600 justify-between"
                  >
                    <Icon className="w-6 h-6 col-span-1 text-black" />
                    <span className="col-span-2">{item.label}</span>
                  </Link>
                </div>
              );
            })}
          </div>
          {/* <Link href="/my-course" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/my-course" className="hover:text-blue-600">
            My Courses
          </Link>
          <Link href="/dashboard/settings" className="hover:text-blue-600">
            Settings
          </Link> */}
        </nav>
      </aside>
    </div>
  );
}
