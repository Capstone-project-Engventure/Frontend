"use client";
import TopicSelect from "@/app/components/TopicSelector";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Topic } from "@/lib/types/topic";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminListening() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const topicService = new TopicService();
  const lessonService = new LessonService();
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    topicService.getAll().then((res) => {
      setTopics(res?.data || []);
    });
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

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Listening Exercises</h1>
      <div className="flex flex-col gap-4"></div>
      <div className="mb-4">
        <label htmlFor="topic" className="block mb-1 font-semibold">
          Select Topic:
        </label>
        {/* <select
          id="topic"
          className="w-full p-2 border rounded"
          onChange={(e) => handleTopicSelect(Number(e.target.value))}
          defaultValue=""
        >
          <option value="" disabled>
            Select a topic...
          </option>
          {topics.length > 0 &&
            topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
        </select> */}
        <TopicSelect
          topics={topicOptions}
          onChange={handleSelect}
          value={topicOptions.find((t) => t.value === selectedTopic) || null}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {lessons.map((lesson) => (
          <Link key={lesson.id} href={`/topics/${lesson.id}`}>
            <a className="border p-4 rounded hover:shadow-lg transition">
              <h4 className="font-semibold">{lesson.name}</h4>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
