// src\app\[locale]\student\my-course\[id]\page.tsx
"use client";

import Breadcrumb from "@/app/[locale]/components/breadcumb";
import SectionCard from "@/app/[locale]/components/card/SectionCard";
import { Course } from "@/lib/types/course";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBook, FaTrophy, FaUser } from "react-icons/fa";
import { OrbitProgress } from "react-loading-indicators";

const mockCourse: Course = {
  id: "1",
  name: "Khóa học Tiếng Anh Cơ Bản",
  scope: "Beginner",
  description: "Khóa học dành cho người mới bắt đầu học tiếng Anh",
  teacher: "Nguyễn Văn An",
  begin: new Date("2024-01-01"),
  end: new Date("2024-06-30"),
  sections: [
    {
      id: 1,
      name: "Bài giới thiệu",
      topic: {
        id: 1,
        title: "ABCXYZ",
      },
      lessons: [
        {
          id: 1,
          title: "Giới thiệu về khóa học",
          level: "A1",
          description: "Tổng quan về khóa học và cách thức học tập",
          type: "lesson",
          readings: [],
          exercises: [],
          image: 'abcabc',
          video: 'sdasdasdsad'
        },
        {
          id: 2,
          title: "Cấu trúc câu đơn giản",
          level: "Beginner",
          description: "Học về cấu trúc câu cơ bản trong tiếng Anh",
          type: "exercise",
          readings: [],
          exercises: [],
          image: null,
          video: null
        }
      ]
    },
    {
      id: 2,
      name: "Danh từ",
      lessons: [
        {
          id: 3,
          title: "Section 1: Các loại danh từ",
          level: "Beginner",
          description: "Phân loại và cách sử dụng danh từ",
          type: "lesson",
          readings: [],
          exercises: [],
          image: 'abcabc',
          video: 'sdasdasdsad'
        },
        {
          id: 4,
          title: "Section 2: Danh từ đếm được và không đếm được. Số ít và số nhiều",
          level: "Beginner",
          description: "Phân biệt danh từ đếm được và không đếm được",
          type: "exercise",
          readings: [],
          exercises: [],
          image: null,
          video: null
        },
        {
          id: 5,
          title: "Section 3: Sở hữu cách",
          level: "Beginner",
          description: "Cách sử dụng sở hữu cách trong tiếng Anh",
          type: "exercise",
          readings: [],
          exercises: [],
          image: null,
          video: null
        },
        {
          id: 6,
          title: "Section 4: Hạn định từ",
          level: "Beginner",
          description: "Sử dụng các hạn định từ với danh từ",
          type: "lesson",
          readings: [],
          exercises: [],
          image: 'abcabc',
          video: 'sdasdasdsad'
        }
      ]
    },
    {
      id: 3,
      name: "Mind map 1",
      lessons: [
        {
          id: 7,
          title: "DANH TỪ 1",
          level: "Beginner",
          description: "Bản đồ tư duy về danh từ phần 1",
          type: "lesson",
          readings: [],
          exercises: [],
          image: 'abcabc',
          video: 'sdasdasdsad'
        },
        {
          id: 8,
          title: "DANH TỪ 2",
          level: "Beginner",
          description: "Bản đồ tư duy về danh từ phần 2",
          type: "lesson",
          readings: [],
          exercises: [],
          image: 'abcabc',
          video: 'sdasdasdsad'
        },
        {
          id: 9,
          title: "HẠN ĐỊNH TỪ",
          level: "Beginner",
          description: "Bản đồ tư duy về hạn định từ",
          type: "exercise",
          readings: [],
          exercises: [],
          image: null,
          video: null
        },
        {
          id: 10,
          title: "SỞ HỮU CÁCH",
          level: "Beginner",
          description: "Bản đồ tư duy về sở hữu cách",
          type: "exercise",
          readings: [],
          exercises: [],
          image: null,
          video: null
        }
      ]
    }
  ]
};

export default function CourseDetailPage() {
  const locale = useLocale();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 3, 7, 8, 9, 10]); // Mock completed lessons

  const breadcrumbs = [
    { label: "Home", href: `/${locale}/student` },
    { label: "Classes", href: `/${locale}/student/my-course` },
    { label: course?.name || "Course", href: `/${locale}/student/my-course/${courseId}` },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await courseService.getById(courseId);
        // setCourse(response.data);

        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCourse(mockCourse);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex flex-col mt-4 min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm">
          <Breadcrumb items={breadcrumbs} />
        </div>
        <div className="flex justify-center items-center h-64">
          <OrbitProgress
            color="#3B82F6"
            size="medium"
            text="Loading..."
            textColor="#3B82F6"
          />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col mt-4 min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm">
          <Breadcrumb items={breadcrumbs} />
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không tìm thấy khóa học
            </h3>
            <p className="text-gray-500">
              Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const completedTotal = completedLessons.length;
  const overallProgress = Math.round((completedTotal / totalLessons) * 100);

  return (
    <div className="flex flex-col mt-4 min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm">
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className="p-6">
        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.name}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-blue-500" />
                  <span>{course.teacher}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaBook className="text-green-500" />
                  <span>{totalLessons} bài học</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaTrophy className="text-yellow-500" />
                  <span>{course.scope}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-1">{overallProgress}%</div>
              <div className="text-sm text-gray-500">Hoàn thành</div>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Sections */}
        <div className="space-y-6">
          {course.sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              sectionIndex={index}
              completedLessons={completedLessons}
            />
          ))}
        </div>
      </div>
    </div>
  );
}