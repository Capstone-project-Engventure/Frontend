"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import { useEffect } from "react";

export default function FavoriteCoursePage() {
  const breadcrumbs = [
    {
      label: "Home",
      href: "/student",
    },
    {
      label: "Favorite Course",
      href: "/student/favorite-course",
    },
  ];
  useEffect(() => {
    console.log("FavoriteCoursePage");
  }, []);
  return (
    <div className="mt-4">
      <Breadcrumb items={breadcrumbs} />
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Favorite Course</h5>
        </div>
      </div>
    </div>
  );
}
