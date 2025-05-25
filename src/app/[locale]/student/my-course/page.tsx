"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import { useApi } from "@/lib/Api";
import CourseService from "@/lib/services/course.service";
import { Course } from "@/lib/types/course";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCalendarCheck, FaUser } from "react-icons/fa";
import { OrbitProgress } from "react-loading-indicators";
import { toast } from "react-toastify";
export default function MyClass() {
  const api = useApi();
  const breadcrumbs = [
    { label: "Home", href: "/student/statistic" },
    { label: "Classes" }, // last item: no href
  ];

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const courseService = new CourseService();
  useEffect(() => {
    const getCourseList = async () => {
      try {
        setIsLoading(true);
        const res = await courseService.getAll({});
        if (!res.success) {
          throw new Error(res.message || "Failed to fetch course list");
        }
        if (!Array.isArray(res.data)) {
          toast.error(res.data);
          return;
        }
        setCourses(res.data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    getCourseList();
  }, []);

  if (isLoading) {
    <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />;
  }
  return (
    <div className="flex flex-col mt-4">
      <Breadcrumb items={breadcrumbs} />
      <div className="grid grid-cols-12 gap-3 p-3 mt-2 ">
        {courses.map((item, index) => {
          const href = `/student/my-course/${item.id}`;
          return (
            <Link
              href={href}
              className="block max-w-sm col-span-12 md:col-span-3 border border-gray-200 rounded-md shadow-md p-4"
              key={index}
            >
              <h3 className="text-2xl text-amber-600">{item.name}</h3>
              <div className="flex flex-row mt-2 text-base items-center">
                <FaCalendarAlt />
                <span className="text-base ml-2">Khai giảng: {item.begin.toLocaleDateString()}</span>
              </div>
              <div className="flex flex-row text-base items-center">
                <FaCalendarCheck />
                <span className="text-base ml-2">Kết thúc {item.end.toLocaleDateString()}</span>
              </div>
              <div className="flex flex-row text-base items-center">
                <FaUser />
                <span className="text-base ml-2">Giáo viên {item.teacher}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
