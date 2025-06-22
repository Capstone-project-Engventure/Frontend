"use client";

import VocabularyService from "@/lib/services/vocabulary.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from "react";

export default function VocabByTopic() {
  //   const { params } = use(paramsPromise);
  //   const {topicId} = useParams()
  const { "topic-id": topicId } = useParams();

  const vocabService = new VocabularyService();
  const [vocabList, setVocabList] = useState<any[]>([]);
  const [vocabExerciseList, setVocabExerciseList] = useState<any[]>([]);
  
  useEffect(() => {
    async function fetchVocabByTopic() {
      try {
        console.log("topic_id", topicId);
        if (topicId && typeof topicId === 'string') {
          const res = await vocabService.getVocabByTopic(topicId);
          console.log("res: ", res.data);

          setVocabList(res.data);
        } else {
          alert("check");
        }
      } catch (err) {
        console.log("err: ", err);
      }
    }

    fetchVocabByTopic();
  }, [topicId]);

  if (vocabList.length == 0) {
    return <div>Không có dữ liệu</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {vocabList.length >0 &&
          vocabList.map((item: any, index: number) => {
            return (
              <div
                key={item.id || index}
                className="border border-gray-300 rounded-lg shadow-md p-4 bg-white"
              >
                <h3 className="text-xl font-semibold mb-2">{item.word}</h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Part of Speech:</span>
                  {item.part_of_speech}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Meaning:</span> {item.meaning}
                </p>
              </div>
            );
          })}
      </div>

      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {vocabExerciseList &&
          vocabExerciseList.map((item: any, index: number) => {
            return (
              <div
                key={item.id || index}
                className="border border-gray-300 rounded-lg shadow-md p-4 bg-white"
              >
                <h3 className="text-xl font-semibold mb-2">{item.word}</h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Part of Speech:</span>
                  {item.part_of_speech}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Meaning:</span> {item.meaning}
                </p>
              </div>
            );
          })}
      </div>
    </>
  );
}
