"use client";
import { SearchInput } from "@/app/components/SearchInput";
import TopicService from "@/lib/services/topic.service";
import { Topic } from "@/lib/types/topic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
export default function VocabularyPractice() {
  //services
  const topicService = new TopicService();
  //props
  const [topics, setTopics] = useState<Topic[]>([]);
  const [keyword, setKeyword] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchTopic() {
      try {
        // const keyword =
        const res = await topicService.getAll(1, 10, keyword);
        if (res.success) {
          setTopics(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchTopic();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-2">
        <SearchInput
          keyword={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tìm kiếm từ vựng"
        />
        <div className="mt-2">
          <h1 className="font-bold text-3xl text-center">Danh sách chủ đề</h1>
          <div className="grid grid-cols-12 gap-4 mt-2.5">
            {topics &&
              topics.map((item, index) => {
                const href = `/student/practice/vocabulary/${item.id}`;
                return (
                  <div className="col-span-12 md:col-span-4" key={index}>
                    <Link
                      className="block border border-gray-400 rounded-md px-4 py-3 hover:shadow-sm transition"
                      key={index}
                      href={href}
                    >
                      <span className="block text-center font-medium">
                        {item.title}
                      </span>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
