"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdOutlineBarChart,
} from "react-icons/md";
import { TbNotes } from "react-icons/tb";
export default function MyCourse() {
  const navbarItem = [
    {
      label: "Thống kê",
      icon: MdOutlineBarChart,
      href: "user/statistic",
    },
    {
      label: "Lớp học của tôi",
      icon: TbNotes,
      href: "online/my-class",
    },
  ];
  return (
    <div className="@container bg-white">
      <p>Đã xem gần đây</p>
    </div>
  );
}
