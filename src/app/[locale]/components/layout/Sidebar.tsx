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

  // Helper function to check if current path exactly matches or is a child of the given path
  const isActiveLink = (linkHref: string, hasChildren: boolean = false) => {
    if (!pathname) return false;
    
    // For exact match without children
    if (!hasChildren) {
      return pathname === linkHref;
    }
    
    // For parent items with children, only active if exactly matches
    return pathname === linkHref;
  };

  // Helper function to check if any child is active
  const hasActiveChild = (children: any[]) => {
    return children?.some(child => pathname === child.href) || false;
  };

  const mainNavItems = [
    {
      label: t("dashboard"),
      icon: MdOutlineBarChart,
      href: `${basePath}/${role === "admin" ? "home" : ""}`,
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
        className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 h-full ${
          toggleSidebar ? "w-72" : "w-20"
        }`}
      >
        <nav className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-row items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Image
                src="/engventure-logo.svg"
                width={40}
                height={40}
                alt="Logo"
                className="shrink-0"
              />
              <span
                className={`text-lg font-bold text-amber-500 transition-opacity duration-300 ${
                  toggleSidebar ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                EngVenture
              </span>
            </div>

            <button
              type="button"
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors duration-200 shrink-0"
              onClick={() => setToggleSidebar((prev) => !prev)}
            >
              {toggleSidebar ? <MdArrowBackIosNew size={16} /> : <MdArrowForwardIos size={16} />}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* Admin Dashboard Link */}
            {isAdmin && (
              <div className="px-4 mb-4">
                <Link 
                  href="/admin/home"
                  className="flex items-center justify-center p-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-200"
                >
                  <span className={toggleSidebar ? "" : "hidden"}>Admin Dashboard</span>
                  {!toggleSidebar && <MdOutlineBarChart size={20} />}
                </Link>
              </div>
            )}

            {/* Main Navigation */}
            <div className="space-y-1 px-3">
              {mainNavItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.href);
                return (
                  <div key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? "bg-blue-100 text-blue-700 font-medium shadow-sm" 
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} size={20} />
                      <span className={`transition-opacity duration-300 ${toggleSidebar ? "opacity-100" : "opacity-0 w-0"}`}>
                        {item.label}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Learning Corner Section */}
            <div className="mt-6">
              <div className={`px-6 py-2 ${toggleSidebar ? "" : "hidden"}`}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Learning Corner
                </h3>
              </div>
              
              <div className="space-y-1 px-3 mt-3">
                {learnNavItems.map((item: any, index) => {
                  const Icon = item.icon;
                  const isActive = item.href ? isActiveLink(item.href) : hasActiveChild(item.children);
                  
                  return (
                    <div key={index}>
                      {/* Parent item */}
                      {item.href ? (
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                            isActive 
                              ? "bg-blue-100 text-blue-700 font-medium shadow-sm" 
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <Icon className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} size={20} />
                          <span className={`transition-opacity duration-300 ${toggleSidebar ? "opacity-100" : "opacity-0 w-0"}`}>
                            {item.label}
                          </span>
                        </Link>
                      ) : (
                        <div>
                          <button
                            className={`flex items-center justify-between w-full gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                              isActive 
                                ? "bg-blue-50 text-blue-700" 
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                            onClick={() => setIsPracticeOpen((prev) => !prev)}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} size={20} />
                              <span className={`transition-opacity duration-300 ${toggleSidebar ? "opacity-100" : "opacity-0 w-0"}`}>
                                {item.label}
                              </span>
                            </div>
                            {toggleSidebar && (
                              <div className="shrink-0">
                                {isPracticeOpen ? <MdArrowDropUp size={20} /> : <MdArrowDropDown size={20} />}
                              </div>
                            )}
                          </button>

                          {/* Children */}
                          {item.children && isPracticeOpen && toggleSidebar && (
                            <div className="mt-1 space-y-1">
                              {item.children.map((child: any, childIndex: any) => {
                                const isChildActive = isActiveLink(child.href);
                                const ChildIcon = child.icon;
                                return (
                                  <Link
                                    key={childIndex}
                                    href={child.href}
                                    className={`flex items-center gap-3 pl-10 pr-3 py-2 rounded-lg transition-all duration-200 group ${
                                      isChildActive
                                        ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                  >
                                    <ChildIcon className={`shrink-0 ${isChildActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} size={16} />
                                    <span className="text-sm">{child.label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </div>
  );
}
