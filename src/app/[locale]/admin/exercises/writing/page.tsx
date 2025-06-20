"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import CustomSelector from "@/app/[locale]/components/CustomSelector";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Exercise } from "@/lib/types/exercise";
import { Lesson } from "@/lib/types/lesson";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LevelOptions } from "@/lib/constants/level";

type OptionType = {
  value: string;
  label: string;
};

export default function WritingExercise() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<OptionType | null>(null);
  const [totalPage, setTotalPage] = useState(7);
  const [lessonsByTopic, setLessonsByTopic] = useState<Lesson[]>([]);
  const [topics, setTopics] = useState([]);
  const [page, setPage] = useState(1);
  // const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const [exerciseTypes, setExerciseTypes] = useState([]);
  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Exercises writing", href: "/admin/exercises/writing" },
  ];

  const fields = [
    { key: "name", label: "Name" },
    { key: "question", label: "Question" },
    // { key: "options", label: "Options" },
    // { key: "audio_file", label: "Audio", type: "audio" },
    // { key: "system_answer", label: "Answer" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "name", label: "Name", type: "text" },
    { key: "question", label: "Question", type: "text" },
    {
      key: "lesson",
      label: "Lesson",
      type: "select",
      options: lessonsByTopic.map((lesson) => ({
        value: String(lesson.id),
        label: lesson.title,
      })),
    },
    {
      key: "type",
      label: "Question type",
      type: "select",
      options: exerciseTypes || [],
    },
    {
      key: "level",
      label: "Level",
      type: "select",
      options: LevelOptions,
    },
    { key: "description", label: "Description", type: "textarea" },
    {
      key: "skill",
      label: "Skill",
      type: "select",
      options: [{ value: "writing", label: "Writing" }],
    },
    { key: "generated_by", label: "", type: "hidden", default: "system" },
  ];

  const exerciseService = new ExerciseService();
  const topicService = new TopicService();
  const lessonService = new LessonService();

  const onPageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await topicService.getAll();
        if (!response.success || !Array.isArray((response as any).data)) {
          toast.error("Failed to fetch topics");
          return;
        }
        const tempList = (response as any).data.map((topic: any) => ({
          value: topic.id,
          label: topic.title,
        }));
        setTopics(tempList);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopic();
  }, []);

  useEffect(() => {
    const fetchLessonsByTopic = async () => {
      if (!selectedTopic) {
        setLessonsByTopic([]);
        return;
      }
      try {
        const response = await lessonService.getAllByTopic(selectedTopic.value);
        if (response.status !== 200 || Array.isArray(response.data) === false) {
          toast.error("Failed to fetch lessons for the selected topic");
          //   throw new Error(response.message || "Failed to fetch lessons");
        }
        setLessonsByTopic(response.data);
      } catch (error) {
        console.error("Error fetching lessons by topic:", error);
      }
    };
    fetchLessonsByTopic();
  }, [selectedTopic]);

  useEffect(() => {
    const fetchWritingExerciseData = async () => {
      setIsLoading(true);
      const filters: { skill: string; lesson?: string } = { skill: "writing" };
      if (selectedLesson) {
        filters.lesson = selectedLesson;
      }
      try {
        const response = await exerciseService.getAll({
          filters: filters,
        });
        if (
          !response.success ||
          !("data" in response) ||
          Array.isArray((response as any).data) === false
        ) {
          toast.error("Failed to fetch exercises");
          setExercises([]);
        } else {
          console.log("Fetched exercises:", (response as any).data);
          setExercises((response as any).data);
        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWritingExerciseData();
  }, [selectedLesson]);

  const onHandleFile = async (file: File) => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }

    try {
      exerciseService.importByFile(file);
    } catch (error) {
      toast.error("Error importing file");
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex flex-col justify-between items-start mb-2 mt-4">
        <div className="flex flex-row items-center space-x-4">
          <label className="text-sm font-semibold">Topics</label>
          <CustomSelector
            objects={topics}
            value={selectedTopic}
            onChange={setSelectedTopic}
            placeholder="Select a topic"
          />
          <label className="text-sm font-semibold">Lessons</label>
          {/* <CustomSelector
            objects={lessonsByTopic}
            value={selectedLesson}
            onChange={setSelectedLesson}
            placeholder="Select a lesson"
          /> */}
        </div>

        <AdvancedDataTable
          // customObjects={exercises}
          page={page}
          fields={fields}
          onPageChange={onPageChange}
          service={exerciseService}
          linkBase="/admin/exercises"
          breadcrumbs={breadcrumbs}
          modalFields={modalFields}
          // onHandleFile={onHandleFile}
          hasCustomFetch={true}
        />
      </div>
    </div>
  );
}
