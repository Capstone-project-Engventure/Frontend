"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import CustomSelector from "@/app/[locale]/components/CustomSelector";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Topic } from "@/lib/types/topic";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminListening() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topicService = new TopicService();
  const lessonService = new LessonService();
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const res = await topicService.getAll();
      if ("success" in res && res.success && Array.isArray(res.data)) {
        setTopics(res.data || []);
      } else {
        setTopics([]);
        toast.error("Error fetching topics");
      }
    };
    fetchTopics();
  }, []);

  const handleSelect = (option: any) => {
    setSelectedTopic(option?.value || null);
    lessonService
      .getAll({ page: 1, pageSize: 10, filters: { topic_id: option?.value } })
      .then((res) => {
        if ("success" in res && res.success && Array.isArray(res.data)) {
          setLessons(res.data);
        } else {
          setLessons([]);
          toast.error("Error fetching lessons");
        }
      });
  };

  const topicOptions = topics.map((t) => ({
    value: String(t.id),
    label: t.title,
  }));

  const breadcrumb = [
    { label: "Admin", href: "/admin" },
    // { label: "Exercises", href: "/admin/exercises" },
    { label: "Listening", href: "/admin/exercises/listening" },
  ];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const locale = useLocale()
  // const soundService = new SoundService();

  const fields = [
    { key: "symbol", label: "Symbol" },
    { key: "word", label: "Word", type:"text" },
    { key: "sound_pronounce", label: "Sound pronounce", type:"textarea" },
    { key: "word_pronounce", label: "Word pronounce", type:"textarea" },
    { key: "sound_audio", label: "Audio", type: "audio" },
    { key: "word_audio", label: "Audio", type: "audio" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "symbol", label: "Symbol", type: "text" },
    { key: "word", label: "Word", type: "text" },
    { key: "sound_pronounce", label: "Sound pronounce", type: "textarea" },
    { key: "word_pronounce", label: "Word pronounce", type: "textarea" },
    { key: "sound_audio", label: "Audio", type: "audio" },
    { key: "word_audio", label: "Audio", type: "audio" },
    { key: "description", label: "Description", type: "text" },
    { key: "translation", label: "Translation", type: "text" },
  ];

  const onHandleFile = async (file: File) => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }
  
    try {
      lessonService.importByFile(file);
    } catch (error) {
      toast.error("Error importing file");
    }
  };

  const onPageChange = (page: number) => {
    setPage(page);
  };
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb items={breadcrumb} />
      <h1 className="text-3xl font-bold">Listening Exercises By Topic</h1>
      <div className="flex flex-col gap-4"></div>
      <div className="mb-4">
        <label htmlFor="topic" className="block mb-1 font-semibold">
          Select Topic:
        </label>
        <CustomSelector
          objects={topicOptions}
          onChange={handleSelect}
          value={selectedTopic}
          placeholder="Select a topic"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {/* {lessons.map((lesson) => (
          // <Link
          //   key={lesson.id}
          //   href={`/admin/exercises/listening/${lesson.id}`}
          //   className="border p-4 rounded hover:shadow-lg transition"
          // >
          //   <h4 className="font-semibold">{lesson.title}</h4>
          //   <p className="text-gray-500">{lesson.description}</p>
          //   <p className="text-gray-400 text-sm">{lesson.created_at} </p>
          // </Link>
         
        ))} */}
       
      </div>
       <AdvancedDataTable
          fields={fields}
          keyField="symbol"
          // breadcrumbs={breadcrumbs}
          customObjects={lessons}
          hasCustomFetch={true}
          page={page}
          onPageChange={onPageChange}
          service={lessonService}
          linkBase={"/" + locale + "/admin/exercises/listening"}
          modalFields={modalFields}
        />
    </div>
  );
}
