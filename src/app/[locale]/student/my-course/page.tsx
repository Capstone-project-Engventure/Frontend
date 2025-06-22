"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import { useApi } from "@/lib/Api";
import CourseService from "@/lib/services/course.service";
import { Course } from "@/lib/types/course";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaUser,
  FaBook,
  FaTrophy,
  FaClock,
} from "react-icons/fa";
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
          toast.error(res.error || "Lỗi khi lấy danh sách khóa học");
          return;
        }
        if (!Array.isArray(res.data)) {
          toast.error("Dữ liệu không hợp lệ");
          return;
        }
        setCourses(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    getCourseList();
  }, []);

  // Hàm tạo avatar động dựa trên tên khóa học
  const generateAvatar = (courseName: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
      "bg-gradient-to-br from-red-400 to-red-600",
    ];

    const initials = courseName
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    const colorIndex = courseName.length % colors.length;

    return (
      <div
        className={`w-16 h-16 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
      >
        {initials}
      </div>
    );
  };

  // Hàm tính progress giả lập (có thể thay thế bằng dữ liệu thực)
  const calculateProgress = (course: Course) => {
    // Tính progress dựa trên thời gian hiện tại so với thời gian bắt đầu và kết thúc
    const now = new Date();
    const start = new Date(course.begin);
    const end = new Date(course.end);

    if (now < start) return 0;
    if (now > end) return 100;

    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.round((current / total) * 100);
  };

  // Hàm định dạng ngày
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <OrbitProgress
          color="#3B82F6"
          size="medium"
          text="Đang tải..."
          textColor="#3B82F6"
        />
      </div>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((item, index) => {
            const href = `/student/my-course/${item.id}`;
            const progress = calculateProgress(item);
            const isCompleted = progress === 100;
            const isActive = progress > 0 && progress < 100;

            return (
              <Link
                href={href}
                className="group block transition-all duration-300 hover:scale-105 hover:shadow-xl"
                key={index}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full">
                  {/* Header với gradient background */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full translate-y-8 -translate-x-8"></div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        {generateAvatar(item.name)}
                        <div className="flex items-center space-x-1">
                          {isCompleted && (
                            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                              <FaTrophy className="mr-1" />
                              Hoàn thành
                            </div>
                          )}
                          {isActive && (
                            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                              <FaClock className="mr-1" />
                              Đang học
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-100 transition-colors">
                        {item.name}
                      </h3>

                      {/* Progress bar */}
                      <div className="w-full bg-blue-400 bg-opacity-30 rounded-full h-2 mb-2">
                        <div
                          className="bg-white h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-sm opacity-90">
                        Tiến độ: {progress}%
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <FaCalendarAlt className="text-blue-500 mr-3 flex-shrink-0" />
                      <span className="font-medium text-gray-800">
                        Khai giảng:
                      </span>
                      <span className="ml-2">{formatDate(item.begin)}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm">
                      <FaCalendarCheck className="text-green-500 mr-3 flex-shrink-0" />
                      <span className="font-medium text-gray-800">
                        Kết thúc:
                      </span>
                      <span className="ml-2">{formatDate(item.end)}</span>
                    </div>

                    {/* <div className="flex items-center text-gray-600 text-sm">
                      <FaUser className="text-purple-500 mr-3 flex-shrink-0" />
                      <span className="font-medium text-gray-800">
                        Giáo viên:
                      </span>
                      <span className="ml-2 truncate">{item.teacher}</span>
                    </div> */}

                    {/* Action button */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-center font-semibold group-hover:bg-blue-100 transition-colors">
                        <FaBook className="inline mr-2" />
                        {isCompleted
                          ? "Xem lại khóa học"
                          : isActive
                          ? "Tiếp tục học"
                          : "Bắt đầu học"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {courses.length === 0 && !isLoading && (
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
