// src\app\[locale]\student\my-course\page.tsx
"use client";

import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import CourseCard from "@/app/[locale]/components/card/CourseCard";
import courseService from "@/lib/services/course.service";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { OrbitProgress } from "react-loading-indicators";
import { toast } from "react-toastify";
import useCourseStore from "@/lib/store/courseStore";

export default function MyClass() {
  const locale = useLocale();

  const breadcrumbs = [
    { label: "Home", href: `/${locale}/student` },
    { label: "Classes", href: `/${locale}/student/my-course` },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const { courses, setCourses, hasFetched, setHasFetched, hasHydrated } = useCourseStore();

  useEffect(() => {
    if (!hasHydrated || hasFetched) return;

    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const res = await courseService.getAll({});
        if (!res.success) {
          toast.error(res.error || "Lỗi khi lấy danh sách khóa học");
          return;
        }
        if (!Array.isArray(res.data)) {
          toast.error("Dữ liệu không hợp lệ");
          return;
        }
        setCourses(res.data);
      } catch (e) {
        console.error(e);
        toast.error("Đã xảy ra lỗi khi tải khóa học");
      }

      setHasFetched(true);
      setIsLoading(false);
    };

    fetchCourses();
  }, [hasHydrated, hasFetched, setHasFetched, setCourses]);

  return (
    <div className="flex flex-col mt-4 min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm">
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Khóa học của tôi
          </h1>
          <p className="text-gray-600">
            Các khóa học bạn đang sở hữu đã được chia theo từng cấp độ, tương
            ứng với mỗi chặng mục tiêu.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <OrbitProgress
              color="#3B82F6"
              size="medium"
              text="Loading..."
              textColor="#3B82F6"
            />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <FaBook />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-500">
              Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học có sẵn!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
