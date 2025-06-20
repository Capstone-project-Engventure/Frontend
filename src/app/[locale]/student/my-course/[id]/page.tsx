"use client";
import { useApi } from "@/lib/Api";
import { use } from "react";
import { useEffect, useState, Fragment } from "react";
import { FaCalendarAlt, FaCalendarCheck, FaUser } from "react-icons/fa";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import type { Course } from "@/lib/types/course";
import type { Lesson } from "@/lib/types/lesson";
// type Lesson = {
//   id: number;
//   title: string;
//   level: string;
//   description: string;
//   topic?: number | null;
// };

// type Course = {
//   id: string;
//   name: string;
//   scope: string;
//   description: string;
//   lessons: Lesson[];
// };

export default function ClassDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const api = useApi();
  const { id: courseId } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  useEffect(() => {
    const fetchCourse = async () => {
      console.log("Course ID:", courseId);
      const savedCourses = localStorage.getItem("course_list");
      if (savedCourses) {
        const courseList = JSON.parse(savedCourses);
        const foundCourse = courseList.find((item: any) => item.id == courseId);

        if (foundCourse) {
          setCourse(foundCourse);
          return;
        }
      }

      try {
        const res = await api.get(`/courses/${courseId}`);
        if (res.status === 200) {
          setCourse(res.data);
          const updatedCourses = savedCourses ? JSON.parse(savedCourses) : [];
          localStorage.setItem(
            "course_list",
            JSON.stringify([...updatedCourses, res.data])
          );
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  if (!course) return <p className="p-4">Loading course...</p>;

  return (
    <div className="flex flex-col">
      <div className="block max-w-sm p-4 mt-2 border rounded shadow">
        <h2 className="text-xl font-bold text-amber-600">{course.name}</h2>
        <div className="mt-2">
          <p>
            <FaCalendarAlt className="inline mr-1" />
            Khai giảng: {course.begin.toLocaleDateString("vi-VN")}
          </p>
          <p>
            <FaCalendarCheck className="inline mr-1" />
            Kết thúc: {course.end.toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
      <div>
        <TabGroup>
          <TabList>
            <Tab as={Fragment}>
              {({ hover, selected }) => (
                <button
                  className={
                    "px-4 py-3 text-amber-500 " +
                    clsx(
                      hover && " border-b-4 border-gray-200 text-black",
                      selected && " border-b-4 border-gray-400 text-black"
                    )
                  }
                >
                  Lịch học
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ hover, selected }) => (
                <button
                  className={
                    "px-4 p-3 text-amber-500 " +
                    clsx(
                      hover && " border-b-4 border-gray-200 text-black",
                      selected && " border-b-4 border-gray-400 text-black"
                    )
                  }
                >
                  Kết quả học tập
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ hover, selected }) => (
                <button
                  className={
                    "px-4 p-3 text-amber-500 " +
                    clsx(
                      hover && " border-b-4 border-gray-200 text-black",
                      selected && " border-b-4 border-gray-400 text-black"
                    )
                  }
                >
                  Bảng xếp hạng coin
                </button>
              )}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {course?.lessons?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {course.lessons.map((item, index) => {
                    const href = `/student/my-lesson/${item.id}`;
                    return (
                      <Link
                        key={item.id || index}
                        className="flex rounded-md shadow-md overflow-hidden border border-gray-200 relative w-full md:w-[300px]"
                        href={href}
                      >
                        <div className="bg-teal-500 text-white px-4 py-6 flex flex-col items-center justify-center w-[80px]">
                          <span className="text-sm">Buổi học</span>
                          <span className="text-3xl font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex flex-col justify-center px-4 py-2 text-sm w-full">
                          <div className="font-semibold text-base">
                            {item.title}
                          </div>
                          <div className="text-gray-600 mb-1">
                            {item.description}
                          </div>
                        </div>

                        <div className="absolute top-1 right-1">
                          <span className="bg-red-400 text-white text-xs px-2 py-1 rounded-full">
                            🔴
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Chưa có bài học nào
                </div>
              )}
            </TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
