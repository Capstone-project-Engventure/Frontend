"use client";

import ExerciseService from "@/lib/services/exercise.service";
import VocabularyService from "@/lib/services/vocabulary.service";
import { Exercise } from "@/lib/types/exercise";
import { set } from "lodash";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { use } from "react";

export default function VocabByTopic() {
  //   const { params } = use(paramsPromise);
  //   const {topicId} = useParams()
  const { "topic-id": topicId } = useParams();

  const audioRef = useRef(null);

  const handlePlay = () => {
    audioRef.current?.play();
  };
  const exerciseService = new ExerciseService();
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [progress, setProgress] = useState(50);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState([]);
  useEffect(() => {
    async function fetchExerciseByTopic() {
      try {
        console.log("topic_id", topicId);
        if (topicId) {
          const filters = { topic: topicId, skill: "listening" };
          const res = await exerciseService.getAll({ filters: filters });
          console.log("res: ", res.data);
          setExerciseList(res.data);
        } else {
          alert("check");
        }
      } catch (err) {
        console.log("err: ", err);
      }
    }
    fetchExerciseByTopic();
  }, [topicId]);

  const handleExercise = () => {
    if (selectedOption == exerciseList[currentIndex]?.system_answer) {
      alert("Correct");
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setProgress((prevProgress) => (prevProgress + 10) % 100);
    }
  };
  //   if (vocabList.length == 0) {
  //     return <div>Không có dữ liệu</div>;
  //   }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Listening Practice {topicId}</h1>
      {/* <!-- Top Bar --> */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-black">✖</button>
          <button className="text-gray-600 hover:text-black">⚙️</button>
        </div>
        <div className="flex-1 mx-4">
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className={"bg-green-500 h-full " + "w-" + progress / 100}
            ></div>
          </div>
        </div>
        <div className="text-red-500 text-xl">❤️❤️❤️❤️❤️</div>
      </div>

      {/* <!-- Question Section --> */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">
          {exerciseList[currentIndex]?.question}
        </h2>

        {/* <!-- Options --> */}
        <div className="space-y-3">
          {Array.isArray(exerciseList[currentIndex]?.options) &&
            exerciseList[currentIndex]?.options.map((option, index) => (
              <button
                key={index}
                className={`w-full py-2 px-4 border rounded-lg transition 
                    ${
                      selectedOption === option.key
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                onClick={() => {
                  setSelectedOption(option?.key);
                }}
              >
                {option?.key} - {option.option}
              </button>
            ))}
        </div>

        {/* <!-- Audio Button --> */}
        <div className="mt-6">
          <audio ref={audioRef} src={exerciseList[currentIndex]?.audio_file} />
          <button
            onClick={handlePlay}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600"
          >
            <span>🔊</span>
            <span>Play Audio</span>
          </button>
        </div>
      </div>

      {/* <!-- Footer --> */}
      <div className="mt-8 flex justify-between">
        <button className="px-4 py-2 border border-gray-400 rounded-full text-gray-700 hover:bg-gray-100">
          Can't listen now
        </button>
        <button
          onClick={handleExercise}
          className="px-6 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700"
        >
          Check
        </button>
      </div>
    </div>
  );
}
