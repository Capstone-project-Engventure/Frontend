import React, { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "@/lib/Api";

type Course = {
  id: number;
  name: string;
  begin: string;
  end: string;
  teacher: string;
};

type CourseContextType = {
  courses: Course[];
  getCourseById: (id: string | number) => Course | undefined;
  setCourses: (courses: Course[]) => void;
};

const CourseContext = createContext<CourseContextType | null>(null);

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const api = useApi();

  useEffect(() => {
    const stored = localStorage.getItem("course_list");
    if (stored) {
      setCourses(JSON.parse(stored));
    } else {
      // Fetch if not found in storage
      api.get("/courses").then((res) => {
        setCourses(res.data);
        localStorage.setItem("course_list", JSON.stringify(res.data));
      });
    }
  }, []);

  const getCourseById = (id: string | number) => {
    return courses.find((c) => c.id == id);
  };

  return (
    <CourseContext.Provider value={{ courses, getCourseById, setCourses }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error("useCourses must be used inside CourseProvider");
  return context;
};
