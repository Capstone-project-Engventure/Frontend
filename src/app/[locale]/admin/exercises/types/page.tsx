"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import TopicService from "@/lib/services/topic.service";
import { ExerciseType } from "@/lib/types/exercise-type";
import { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";

export default function AdminExerciseTypesPage() {
  const exerciseTypeService = new ExerciseTypeService();
  const topicService = new TopicService();
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [topics, setTopics] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const fields = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "name", label: "Name", type: "text" },
    { key: "description", label: "Description", type: "text" },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Exercises", href: "/admin/exercises" },
    { label: "Types" }, // last item: no href
  ];

  const onPageChange = (page: number) => {
    setPage(page);
  };
  const [formData, setFormData] = useState<any>(null);
  const isModalOpen = formData !== null;


  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    // Fix the component with ts
    <>
      <div className="py-2">
        <Breadcrumb items={breadcrumbs} />
      </div>
      <AdvancedDataTable
        // objects={exerciseTypes}
        fields={fields}
        page={page}
        service={exerciseTypeService}
        modalFields={modalFields}
        onPageChange={onPageChange}
        linkBase="/admin/exercises"
      />
     
    </>
  );
}
