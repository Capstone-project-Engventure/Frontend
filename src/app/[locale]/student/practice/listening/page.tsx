"use client"
import TopicService from "@/lib/services/topic.service";
import { Topic } from "@/lib/types/topic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ListeningPracticeList: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
 
  const topicService = new TopicService();
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const params = {page: 1, pageSize: 10};
        const response = await topicService.getAll(params);
        if (!response.success) {
          throw new Error("Network response was not ok");
        }
        if (Array.isArray(response.data)) {
          // toast.error("Invalid data format");
          setTopics(response.data);
        }
        
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="container">
      <h1>Listening Practice</h1>
      <div className=" w-full grid grid-cols-3 gap-2 p-2">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="col-span-1 border border-gray-300 rounded-md card px-2 py-3"
          >
            <Link href={`/student/practice/listening/${topic.id}`}>
            <h2 className="font-bold text-2xl">{topic?.title}</h2>
            <p className="text-base text-gray-400">{topic?.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeningPracticeList;
