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

import { BiCategory } from "react-icons/bi";
import { TbNotes } from "react-icons/tb";
import { usePathname } from "next/navigation";
export default function Sidebar() {
  const pathname = usePathname();
  const [toggleSidebar, setToggleSidebar] = useState(false);
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
      label: "Quản lý dữ liệu",
      icon: TbNotes,
      children: [
        {
          label: "Từ vựng",
          href: "/admin/exercises/vocabulary",
        },
        {
          label: "Ngữ pháp",
          href: "/admin/exercises/grammar",
        },
        {
          label: "Nghe",
          href: "/admin/exercises/listening",
        },
        {
          label: "Phát âm",
          href: "/admin/exercises/pronunciation",
        },
      ],
    },
    {
      label: "Tạo dữ liệu",
      icon: TbNotes,
      href: "/admin/generate",
    },
    {
      label: "Kiểu bài học",
      icon: BiCategory,
      href: "/admin/exercises/types",
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
      <aside
        className={`bg-white shadow-md p-4 transition-all duration-300 h-full ${
          toggleSidebar ? "w-64" : "w-28"
        }`}
      >
        <nav className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-center justify-center">
            <Link href="/" className="flex flex-row items-center gap-2">
              <Image
                src="/engventure-logo.svg"
                width={60}
                height={60}
                alt="Logo"
              />
              <span
                className={`text-xl font-bold text-amber-500 ${
                  toggleSidebar ? "" : "hidden"
                }`}
              >
                EngVenture
              </span>
            </Link>
            <button
              type="button"
              className="p-2 bg-gray-200 text-black rounded-md"
              onClick={() => setToggleSidebar((prev) => !prev)}
            >
              {toggleSidebar ? <MdArrowForwardIos /> : <MdArrowBackIosNew />}
            </button>
          </div>
          <div className="min-h-screen">
            {mainNavItems.map((item, index) => {
              const isActive = pathname?.startsWith(item.href);
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
            <p className="font-bold">Learning corner</p>
            {learnNavItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={index} className="px-3 py-2">
                  {/* Render parent item */}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="grid grid-cols-3 hover:text-blue-600 justify-between"
                    >
                      {Icon && (
                        <Icon className="w-6 h-6 col-span-1 text-black" />
                      )}
                      <span className="col-span-2">{item.label}</span>
                    </Link>
                  ) : (
                    <div className="grid grid-cols-3">
                      <div className="col-span-1 font-semibold">
                        {Icon && (
                          <Icon className="w-6 h-6 col-span-1 text-black" />
                        )}
                      </div>
                      <div className="flex flex-row col-span-2 gap-2">
                        <span className="col-span-2">{item.label}</span>
                        <div className="flex flex-row left-auto">
                          <MdArrowDropDown className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render children if they exist */}
                  {item.children && (
                    <div className="ml-6 mt-2 space-y-1 text-sm text-gray-700">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.href}
                          className="block hover:text-blue-600"
                        >
                          <span className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group ">
                            {child.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </aside>
    </div>
  );
}
