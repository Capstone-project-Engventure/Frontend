"use client";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import CourseService from "@/lib/services/course.service";
import { Course } from "@/lib/types/course";
import { useState } from "react";

import {
  HiPlus,
} from "react-icons/hi";

export default function AdminCourse() {
  const courseService = new CourseService();
  const [page, setPage] = useState(1);
  const onPageChange = (page: number) => {
    setPage(page);
  };
  const fields =[
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "begin", label: "Begin Date" },
    { key: "end", label: "End Date" },
  ]

  return (
    <>
      <div className="flex justify-end mb-4">
      </div>
      <AdvancedDataTable
        fields={fields}
        page={page}
        service={courseService}
        onPageChange={onPageChange}
        linkBase="/admin/lessons"
      />
     
    </>
  );
}
