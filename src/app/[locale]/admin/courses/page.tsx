"use client";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import { useApi } from "@/lib/Api";
import CourseService from "@/lib/services/course.service";
import { PaginatedResponse } from "@/lib/types/response";
import { Course } from "@/lib/types/course";
import { useEffect, useState } from "react";

import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

export default function AdminCourse() {
  const courseService = new CourseService();
  const [isLoading, setIsLoading] = useState(false);
  //   const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const onPageChange = (page: number) => {
    setPage(page);
  };

  const [formData, setFormData] = useState<any>(null);
  const isModalOpen = formData !== null;
  const fields =[
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "begin", label: "Begin Date" },
    { key: "end", label: "End Date" },
  ]



  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
      </div>
      <PaginationTable
        fields={fields}
        page={page}
        service={courseService}
        onPageChange={onPageChange}
        linkBase="/admin/lessons"
      />
     
    </>
  );
}
