"use client";
import Breadcrumb from "@/app/components/breadcumb";
import { useApi } from "@/lib/Api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCalendarCheck, FaUser } from "react-icons/fa";
import {OrbitProgress} from "react-loading-indicators"
export default function MyClass() {
  const api = useApi();
  const breadcrumbs = [
    { label: "Home", href: "/student/statistic" },
    { label: "Classes" }, // last item: no href
  ];

  const [courses,setCourses] = useState([
    {
      id: "english-basics",
      name: "English Basics",
      teacher: "Ms. Alice Nguyen",
      begin: "2025-04-20T08:00:00",
      end: "2025-04-20T09:30:00",
      href: "/classes/english-basics",
    },
    {
      id: "conversational-english",
      name: "Conversational English",
      teacher: "Mr. John Tran",
      begin: "2025-04-20T10:00:00",
      end: "2025-04-20T11:30:00",
      href: "/classes/conversational-english",
    },
    {
      id: "business-english",
      name: "Business English",
      teacher: "Ms. Emily Vo",
      begin: "2025-04-21T14:00:00",
      end: "2025-04-21T15:30:00",
      href: "/classes/business-english",
    },
    {
      id: "toeic-preparation",
      name: "TOEIC Preparation",
      teacher: "Mr. Nam Pham",
      begin: "2025-04-21T16:00:00",
      end: "2025-04-21T17:30:00",
      href: "/classes/toeic-preparation",
    },
    {
      id: "ielts-speaking",
      name: "IELTS Speaking",
      teacher: "Ms. Sarah Le",
      begin: "2025-04-22T09:00:00",
      end: "2025-04-22T10:30:00",
      href: "/classes/ielts-speaking",
    },
    {
      id: "grammar-mastery",
      name: "Grammar Mastery",
      teacher: "Mr. David Bui",
      begin: "2025-04-22T13:00:00",
      end: "2025-04-22T14:30:00",
      href: "/classes/grammar-mastery",
    },
    {
      id: "pronunciation-practice",
      name: "Pronunciation Practice",
      teacher: "Ms. Linh Do",
      begin: "2025-04-23T08:30:00",
      end: "2025-04-23T10:00:00",
      href: "/classes/pronunciation-practice",
    },
    {
      id: "writing-skills",
      name: "Writing Skills",
      teacher: "Mr. Kevin Hoang",
      begin: "2025-04-23T15:00:00",
      end: "2025-04-23T16:30:00",
      href: "/classes/writing-skills",
    },
    {
      id: "listening-lab",
      name: "Listening Lab",
      teacher: "Ms. Jenny Pham",
      begin: "2025-04-24T11:00:00",
      end: "2025-04-24T12:30:00",
      href: "/classes/listening-lab",
    },
    {
      id: "advanced-vocabulary",
      name: "Advanced Vocabulary",
      teacher: "Mr. Tuan Nguyen",
      begin: "2025-04-24T17:00:00",
      end: "2025-04-24T18:30:00",
      href: "/classes/advanced-vocabulary",
    },
    {
      id: "english-for-travel",
      name: "English for Travel",
      teacher: "Ms. Lisa Tran",
      begin: "2025-04-25T09:00:00",
      end: "2025-04-25T10:30:00",
      href: "/classes/english-for-travel",
    },
    {
      id: "public-speaking",
      name: "Public Speaking",
      teacher: "Mr. Hieu Le",
      begin: "2025-04-25T14:00:00",
      end: "2025-04-25T15:30:00",
      href: "/classes/public-speaking",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getCourseList = async () => {
      try {
        setIsLoading(true)
        const res = await api.get("/courses")
        if (res.status === 200) {
          setCourses(res.data)
        } else {
          throw new Error(`Unexpected status: ${res.status}`)
        }
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    getCourseList()
  }, [])

  if(isLoading){
    <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />
  }
  return (
    <div className="flex flex-col mt-4">
      <Breadcrumb items={breadcrumbs} />
      <div className="grid grid-cols-12 gap-3 p-3 mt-2">
        {courses.map((item, index) => {
          const href = `/student/my-course/${item.id}`
          return (
            <Link
              href={href}
              className="block max-w-sm col-span-12 md:col-span-3 border border-gray-200 rounded-md shadow-md p-4"
              key={index}
            >
              <h3 className="text-2xl text-amber-600">{item.name}</h3>
              <div className="flex flex-row mt-2 text-base items-center">
                <FaCalendarAlt />
                <span className="text-base ml-2">Khai giảng: {item.begin}</span>
              </div>
              <div className="flex flex-row text-base items-center">
                <FaCalendarCheck />
                <span className="text-base ml-2">Kết thúc {item.end}</span>
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
