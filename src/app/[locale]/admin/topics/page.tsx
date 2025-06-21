"use client";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import { useApi } from "@/lib/Api";
import { CategoryOptions } from "@/lib/constants/category";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Lesson } from "@/lib/types/lesson";
import { PaginatedResponse } from "@/lib/types/response";
import { Topic } from "@/lib/types/topic";
import { useEffect, useState } from "react";

import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { toast } from "react-toastify";

export default function AdminTopic() {
  const topicService = new TopicService();
  const lessonService = new LessonService();
  const [isLoading, setIsLoading] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(7);
  const [keyword, setKeyword] = useState("");

  const fields = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "description", label: "Description" },
    // { key: "order", label: "Order" },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Topic" },
  ];

  const modalFields = [
    { key: "title", label: "Title", type: "text" },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: CategoryOptions,
    },
    { key: "description", label: "Description", type: "textarea" },
    // { key: "order", label: "Order", type: "number" },
  ];

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const [formData, setFormData] = useState<any>(null);
  const isModalOpen = formData !== null;

  const handleAddClick = () => {
    setFormData({
      title: "",
      level: "",
      topic: "",
      description: "",
    });
  };

  function fetchLessonData() {
  throw new Error("Function not implemented.");
}


  const onHandleFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await lessonService.importByFile(file);
      if (res.status === 200) {
        toast.success("Import file thành công");
        fetchLessonData();
      } else {
        toast.error("Import file thất bại");
      }
    } catch (error) {
      console.error("Error importing file:", error);
      toast.error("Import file thất bại");
    }
  };

  // if (isLoading) {
  //   return <div>Đang tải dữ liệu...</div>;
  // }

  return (
    // Fix the component with ts
    <>
      <AdvancedDataTable
        fields={fields}
        page={page}
        onPageChange={onPageChange}
        service={topicService}
        linkBase="/admin/topics"
        breadcrumbs={breadcrumbs}
        modalFields={modalFields}
        // onHandleFile={onHandleFile}
      />
    </>
  );
}

