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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Card 1</h5>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center">Lớp học của tôi</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Card 1</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
