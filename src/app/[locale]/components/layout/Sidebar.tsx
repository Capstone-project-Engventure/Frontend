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
  MdLibraryBooks,
  MdOutlineVolumeUp,
  MdOutlineRecordVoiceOver,
  MdEditNote,
} from "react-icons/md";

import { BiCategory } from "react-icons/bi";
import { TbNotes } from "react-icons/tb";
import { FaRegLightbulb } from "react-icons/fa6";
import { GiSpellBook } from "react-icons/gi";

import { User } from "@/lib/types/user";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";

export default function Sidebar({ role }: { role: "admin" | "student" }) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const locale = pathname.split("/")[1];
  const basePath = `/${locale}/${role}`;

  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [isPracticeOpen, setIsPracticeOpen] = useState(true);

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
      label: t("dashboard"),
      icon: MdOutlineBarChart,
      href: `${basePath}/${role === "admin" ? "dashboard" : "statistic"}`,
    },
    {
      label: t(role === "admin" ? "courses" : "myCourses"),
      icon: TbNotes,
      href: `${basePath}/${role === "admin" ? "courses" : "my-course"}`,
    },
  ];

  const learnNavItems = [
    {
      label: t(role === "admin" ? "lessons" : "myLessons"),
      icon: MdOutlineBarChart,
      href: `${basePath}/${role === "admin" ? "lessons" : "my-lesson"}`,
    },
    {
      label: t(role === "admin" ? "topics" : "favoriteLessons"),
      icon: TbNotes,
      href: `${basePath}/${role === "admin" ? "topics" : "favorite-course"}`,
    },
    {
      label: t(role === "admin" ? "exercises" : "practice"),
      icon: TbNotes,
      children: [
        ...(role === "admin"
          ? [
              {
                label: t("allExercises"),
                href: `${basePath}/exercises`,
                icon: MdLibraryBooks,
              },
            ]
          : []),
        {
          label: t("reading"),
          href: `${basePath}/${
            role === "admin" ? "exercises/reading-lessons" : "practice/reading"
          }`,
          icon: MdLibraryBooks,
        },
        {
          label: t("grammar"),
          href: `${basePath}/${
            role === "admin" ? "exercises/grammar-lessons" : "practice/grammar"
          }`,
          icon: GiSpellBook,
        },
        {
          label: t("listening"),
          href: `${basePath}/${
            role === "admin" ? "exercises/listening" : "practice/listening"
          }`,
          icon: MdOutlineVolumeUp,
        },
        // {
        //   label: t("pronunciation"),
        //   href: `${basePath}/${
        //     role === "admin"
        //       ? "exercises/pronunciation"
        //       : "practice/pronunciation"
        //   }`,
        //   icon: MdOutlineRecordVoiceOver,
        // },
        {
          label: t("writing"),
          href: `${basePath}/${
            role === "admin" ? "exercises/writing" : "practice/writing"
          }`,
          icon: MdEditNote,
        },
        {
          label: t("speaking"),
          href: `${basePath}/${
            role === "admin"
              ? "exercises/speaking"
              : "practice/speaking"
          }`,
          icon: MdOutlineRecordVoiceOver,
        }
      ],
    },
    ...(role === "admin"
      ? [
          {
            label: t("data"),
            icon: TbNotes,
            children: [
              {
                label: t("vocabulary"),
                href: `${basePath}/${"data/vocabularies"}`,
                icon: MdLibraryBooks,
              },
              {
                label: t("phonetics"),
                href: `${basePath}/${"data/phonetics"}`,
                icon: MdOutlineRecordVoiceOver,
              },
            ],
          },
          {
            label: t("generate"),
            icon: FaRegLightbulb,
            href: `${basePath}/generate`,
          },
          {
            label: t("types"),
            icon: BiCategory,
            href: `${basePath}/exercises/types`,
          },
        ]
      : []),
    {
      label: t("flashcard"),
      icon: MdLibraryBooks,
      href: `${basePath}/flashcard`,
    },
    {
      label: t("myNote"),
      icon: TbNotes,
      href: `${basePath}/my-note`,
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
              Learning corner
            </p>
            {learnNavItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <div
                  key={index}
                  className={`px-2 py-2 ${
                    isActive ? "bg-blue-100 rounded-md" : ""
                  }`}
                >
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
                    <div
                      className="grid grid-cols-3 cursor-pointer hover:text-blue-600"
                      onClick={() => setIsPracticeOpen((prev) => !prev)}
                    >
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
                  {item.children && isPracticeOpen && (
                    <div className="ml-6 mt-2 space-y-1 text-sm text-gray-700">
                      {item.children.map((child, childIndex) => {
                        const isChildActive = pathname?.startsWith(child.href);
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={childIndex}
                            href={child.href}
                            className={`flex items-center gap-2 p-2 rounded-md transition duration-150 ${
                              isChildActive
                                ? "bg-blue-200 text-blue-800 font-medium"
                                : "hover:bg-gray-100 text-gray-800"
                            } ${toggleSidebar ? "" : "hidden"}`}
                          >
                            {ChildIcon && <ChildIcon className="w-5 h-5" />}
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
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
