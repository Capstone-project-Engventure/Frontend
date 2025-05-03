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
export default function Sidebar() {
  const pathname = usePathname();
  const [toggleSidebar, setToggleSidebar] = useState(false);
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
        className={`bg-white shadow-md p-4 transition-all duration-300 ${
          toggleSidebar ? "w-64" : "w-20"
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
                <div className="px-3 py-2" key={index}>
                  <Link
                    href={item.href}
                    className="grid grid-cols-3 hover:text-blue-600 justify-between"
                  >
                    <Icon className="w-6 h-6 col-span-1 text-black" />
                    <span
                      className={`text-black col-span-2 font-bold ${
                        toggleSidebar ? "" : "hidden"
                      }`}
                    >
                      {item.label}
                    </span>
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
