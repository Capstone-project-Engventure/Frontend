"use client";
// import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdArrowBackIosNew,
  MdArrowForwardIos,
  MdOutlineBarChart,
} from "react-icons/md";
import { TbNotes } from "react-icons/tb";
import { User } from "@/lib/types/user";
import Cookies from "js-cookie";

export default function Sidebar() {
  const pathname = usePathname();
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const tokenInfo = Cookies.get("tokenInfo") || null;
  const userStr = Cookies.get("user") || null;
  const user = userStr ? (JSON.parse(userStr) as User) : null;
  const [isAdmin, setIsAdmin] = useState(false);
  if (tokenInfo) {
    const jsonTokenInfo = JSON.parse(tokenInfo);
    if (jsonTokenInfo.role == "admin") setIsAdmin(true);
  }

  useEffect(() => {
    if (user) {
      const isSuperAdmin = user.roles.some(
        (role) => role.name === "Super Administrator"
      );
      setIsAdmin(isSuperAdmin);
    }
  }, []);

  const mainNavItems = [
    {
      label: "Thống kê",
      icon: MdOutlineBarChart,
      href: "/student/statistic",
    },
    {
      label: "Lớp học của tôi",
      icon: TbNotes,
      href: "/student/my-course",
    },
  ];

  const learnNavItems = [
    {
      label: "Khóa học",
      icon: MdOutlineBarChart,
      href: "/student/my-lesson",
    },
    {
      label: "Bài học yêu thích",
      icon: TbNotes,
      href: "/student/favorite-course",
    },
    {
      label: "Luyện tập",
      icon: TbNotes,
      children: [
        {
          label: "Từ vựng",
          href: "/student/practice/vocabulary",
        },
        {
          label: "Ngữ pháp",
          href: "/student/practice/grammar",
        },
        {
          label: "Nghe",
          href: "/student/practice/listening",
        },
        {
          label: "Phát âm",
          href: "/student/practice/pronunciation",
        },
      ],
    },
    {
      label: "Flashcard",
      icon: TbNotes,
      href: "/student/flashcard",
    },
    {
      label: "Ghi chú",
      icon: TbNotes,
      href: "/student/my-note",
    },
  ];

  useEffect(() => {
    console.log("pathname: ", pathname);
  }, [pathname]);

  return (
    <div>
      <aside
        className={`bg-white shadow-md p-4 transition-all duration-300 h-full ${
          toggleSidebar ? "w-64" : "w-28"
        }`}
      >
        <nav className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-center justify-center">
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

            <button
              type="button"
              className="p-2 bg-gray-200 text-black rounded-md"
              onClick={() => setToggleSidebar((prev) => !prev)}
            >
              {toggleSidebar ? <MdArrowBackIosNew /> : <MdArrowForwardIos />}
            </button>
          </div>

          {/* Main Nav */}
          <div className="min-h-screen">
            <div className="flex p-2 justify-center items-center">
              {isAdmin ? (
                <Link href="/admin/home">
                  <span className="font-bold">Admin Dashboard</span>
                </Link>
              ) : (
                <span></span>
              )}
            </div>

            {mainNavItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <div
                  className={`px-2 py-2 ${
                    isActive ? "bg-blue-100 rounded-md" : ""
                  }`}
                  key={index}
                  data-tooltip-target="tooltip-no-arrow"
                >
                  <Link
                    href={item.href}
                    className="grid grid-cols-3 hover:text-blue-600 justify-between"
                  >
                    <Icon className="w-6 h-6 col-span-1 text-black" />
                    <span
                      className={`text-black col-span-2 ${
                        toggleSidebar ? "" : "hidden"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                  <div
                    id="tooltip-no-arrow"
                    role="tooltip"
                    className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
                  >
                    {item.label}
                  </div>
                </div>
              );
            })}
            <p className={`font-bold ${toggleSidebar ? "" : "hidden"}`}>
              Góc học tập
            </p>
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
                      <span
                        className={`col-span-2 ${
                          toggleSidebar ? "" : "hidden"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <div className="grid grid-cols-3">
                      <div className="col-span-1 font-semibold">
                        {Icon && (
                          <Icon className="w-6 h-6 col-span-1 text-black" />
                        )}
                      </div>
                      <div className="flex flex-row col-span-2 gap-2">
                        <span
                          className={`col-span-2 ${
                            toggleSidebar ? "" : "hidden"
                          }`}
                        >
                          {item.label}
                        </span>
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
                          <span
                            className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group 
                           ${toggleSidebar ? "" : "hidden"}`}
                          >
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
