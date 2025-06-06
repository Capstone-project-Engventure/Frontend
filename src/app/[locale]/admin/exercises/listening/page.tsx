"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import CustomSelector from "@/app/[locale]/components/CustomSelector";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Topic } from "@/lib/types/topic";
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
      if (Array.isArray(res.data)) {
        setTopics(res?.data || []);
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
      .then((res) => setLessons(res.data));
  };

  const topicOptions = topics.map((t) => ({
    value: t.id,
    label: t.title,
  }));

  const breadcrumb = [
    { label: "Admin", href: "/admin" },
    // { label: "Exercises", href: "/admin/exercises" },
    { label: "Listening", href: "/admin/exercises/listening" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb items={breadcrumb}/>
      <h1 className="text-3xl font-bold">Listening Exercises By Topic</h1>
      <div className="flex flex-col gap-4"></div>
      <div className="mb-4">
        <label htmlFor="topic" className="block mb-1 font-semibold">
          Select Topic:
        </label>
        <CustomSelector
          topics={topicOptions}
          onChange={handleSelect}
          value={selectedTopic}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/admin/exercises/listening/${lesson.id}`}
            className="border p-4 rounded hover:shadow-lg transition"
          >
            <h4 className="font-semibold">{lesson.title}</h4>
            <p className="text-gray-500">{lesson.description}</p>
            <p className="text-gray-400 text-sm">{lesson.created_at} </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
