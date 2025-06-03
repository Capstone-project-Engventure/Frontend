"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import CustomSelector from "@/app/[locale]/components/TopicSelector";
import { LevelOptions } from "@/lib/constants/level";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Exercise } from "@/lib/types/exercise";
import { Lesson } from "@/lib/types/lesson";
import { OptionType } from "@/lib/types/option";
import { Topic } from "@/lib/types/topic";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminGrammar() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(7);
  const [lessonsByTopic, setLessonsByTopic] = useState<Lesson[]>([]);
  const [topicOptions, setTopicOptions] = useState<OptionType[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [allLessonOptions, setAllLessonsOptions] = useState<OptionType[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const [exerciseTypes, setExerciseTypes] = useState([]);
  const locale = useLocale()
  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Exercises writing", href: "/admin/exercises/writing" },
  ];

  const fields = [
    { key: "name", label: "Name" },
    { key: "question", label: "Question" },
    { key: "options", label: "Options" },
    { key: "level", label: "Level" },
    { key: "system_answer", label: "Answer" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "name", label: "Name", type: "text" },
    { key: "question", label: "Question", type: "text" },
    {
      key: "lesson",
      label: "Lesson",
      type: "select",
      options: lessonsByTopic || [],
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
      options: [{ key: "writing", label: "Writing" }],
    },
    { key: "generated_by", type: "hidden", default: "system" },
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
        if (!response.success || Array.isArray(response.data) === false) {
          toast.error("Failed to fetch topics");
          return;
        }
        const tempList = response.data.map((topic: any) => ({
          value: topic.id,
          label: topic.title,
        }));
        setTopicOptions(tempList);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopic();
  }, []);

  useEffect(() => {
    const fetchAllLessons = async () => {
      try {
        const response = await lessonService.getAll();
        if (response.success) {
          setAllLessons(response.data);
        } else {
          toast.error("Failed to fetch lessons");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllLessons();
  }, []);

  useEffect(() => {
    const tempList = allLessons.map((lesson: any) => ({
      value: lesson.id,
      label: lesson.title,
    }));
    if (!selectedTopic) {
      setFilteredLessons(tempList);
      return;
    }

    const filtered = allLessons
      .filter((lesson) => lesson.topic?.id === selectedTopic.value)
      .map((lesson) => ({
        value: lesson.id,
        label: lesson.title,
      }));

    setFilteredLessons(filtered);

    // Reset selectedLesson if it doesn't belong to this topic
    if (selectedLesson) {
      const found = filtered.find((l) => l.id === selectedLesson);
      if (!found) setSelectedLesson(null);
    }
  }, [selectedTopic, allLessons]);

  useEffect(() => {
    const fetchWritingExerciseData = async () => {
      setIsLoading(true);
      const filters = { skill: "grammar" };
      if (selectedLesson) {
        filters.lesson = selectedLesson;
      }
      try {
        const response = await exerciseService.getAll({
          page: page,
          pageSize: pageSize,
          filters: filters,
        });
        if (!response.success || Array.isArray(response.data) === false) {
          toast.error("Failed to fetch exercises");
          return;
          //   throw new Error(response.message || "Failed to fetch exercises");
        }
        console.log("Fetched exercises:", response.data);
        setExercises(response.data);
        setTotalPage(response.total_page);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWritingExerciseData();
  }, [page, selectedLesson]);

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
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <div>
            <label className="block text-sm font-medium">Topic</label>
            <CustomSelector
              objects={topicOptions}
              value={selectedTopic}
              onChange={setSelectedTopic}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Lesson</label>
            <CustomSelector
              objects={filteredLessons}
              value={selectedLesson}
              onChange={setSelectedLesson}
            />
          </div>
        </div>

        <PaginationTable
          customObjects={exercises}
          customTotalPages={totalPage}
          fields={fields}
          page={page}
          onPageChange={onPageChange}
          service={exerciseService}
          linkBase={"/"+locale+"/admin/data/sound"}
          breadcrumbs={breadcrumbs}
          modalFields={modalFields}
          onHandleFile={onHandleFile}
          hasBreadcrumb={false}
          hasCustomFetch={true}
        />
      </div>
    </div>
  );
}
