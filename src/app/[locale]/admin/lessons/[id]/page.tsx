"use client";
import CustomSelector from "@/app/[locale]/components/CustomSelector";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import Modal from "@/app/[locale]/components/ui/Modal";
import { LevelOptions } from "@/lib/constants/level";
import { SkillOptions } from "@/lib/constants/skill";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import { Exercise } from "@/lib/types/exercise";
import { Lesson } from "@/lib/types/lesson";
import { OptionType } from "@/lib/types/option";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "use-intl";

export default function AdminLessonDetail() {
  /* ─────────────── state ─────────────── */
  const [isLoading, setIsLoading] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exerciseTypes, setExerciseTypes] = useState<OptionType[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [filters, setFilters] = useState({ type: "", skill: "" });

  /* ─────────────── services & i18n ─────────────── */
  const lessonService = new LessonService();
  const exerciseService = new ExerciseService();
  const exerciseTypeService = new ExerciseTypeService();
  const { id } = useParams();
  const locale = useLocale();
  const t = useTranslations("Admin.Lessons.Detail");

  /* ─────────────── breadcrumbs ─────────────── */
  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: `/${locale}/admin` },
    { label: t("breadcrumbs.manageLessons"), href: `/${locale}/admin/lessons` },
    {
      label: t("breadcrumbs.lessonDetail"),
      href: `/${locale}/admin/lessons/${id}`,
    },
  ];

  /* ─────────────── table form fields ─────────────── */
  const fields = useMemo(
    () => [
      { key: "name", label: t("fields.name"), type: "text" },
      { key: "question", label: t("fields.question"), type: "text" },
      { key: "system_answer", label: t("fields.systemAnswer"), type: "text" },
      {
        key: "type.name",
        label: t("fields.questionType"),
        isNested: true,
        type: "object",
        nestKey: "name",
        // type: "select",
        // options: exerciseTypes,
      },
      {
        key: "level",
        label: t("fields.level"),
        type: "select",
        options: LevelOptions,
      },
      {
        key: "description",
        label: t("fields.description"),
        type: "textarea",
      },
      {
        key: "skill",
        label: t("fields.skill"),
        type: "select",
        options: SkillOptions,
      },
    ],
    [t, exerciseTypes]
  );

  /* modal field list (if you still need it in PaginationTable) */
  const modalField = useMemo(
    () => [
      { label: t("exercise.title"), value: "title" },
      { label: t("exercise.question"), value: "question" },
      { label: t("exercise.description"), value: "description" },
      { label: t("exercise.type"), value: "type" },
    ],
    [t]
  );

  /* ─────────────── fetch helpers ─────────────── */
  useEffect(() => {
    /** exercise types for select */
    (async () => {
      try {
        const res = await exerciseTypeService.getAll();
        if (res.success) {
          setExerciseTypes(
            res.data.map((v: any) => ({ value: v.id, label: v.name }))
          );
        } else {
          toast.error(t("messages.fetchExerciseTypesFail"));
        }
      } catch {
        toast.error(t("messages.networkError"));
      }
    })();
  }, [t]);

  useEffect(() => {
    /** lesson by id */
    (async () => {
      if (!id) {
        toast.error(t("messages.noLessonId"));
        return;
      }
      setIsLoading(true);
      try {
        const res = await lessonService.getById(id);
        if (res.success) setLesson(res.data);
        else toast.error(t("messages.fetchLessonFail"));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, t]);

  /* filter exercises not already linked  */
  const fetchFilteredExercises = async () => {
    if (!lesson) {
      return;
    }
    try {
      const res = await exerciseService.getAll();
      if (!res.success) {
        toast.error(t("messages.fetchExercisesFail"));
        return;
      }
      console.log("Filtered Skill:", filters.skill);
      console.log("Filtered Type:", filters.type);

      const inLessonIds = lesson.exercises.map((e) => e.id);
      const filtered = res.data.filter((ex: any) => {
        const notInLesson = !inLessonIds.includes(ex.id);
        const matchType = filters.type ? ex.type === filters.type?.value : true;
        const matchSkill = filters.skill
          ? ex.skill === filters.skill?.value
          : true;

        const shouldInclude = notInLesson && matchType && matchSkill;
        return shouldInclude;
      });
      console.log("Filtered Exercises:", filtered);

      setFilteredExercises(filtered);
    } catch {
      toast.error(t("messages.fetchExercisesFail"));
    }
  };

  useEffect(() => {
    fetchFilteredExercises();
  }, [filters]);

  /* attach selected exercises */
  const handleAttachExercisesToLesson = async () => {
    if (!selectedExercises.length || !id) return;
    console.log("Attaching exercises:", selectedExercises);

    try {
      const requests = selectedExercises.map((exercise: Exercise) =>
        exerciseService.partialUpdate(
          exercise?.id,
          { lesson: id },
          { config: { headers: { "Accept-Language": locale } } }
        )
      );
      const results = await Promise.all(requests);
      const failed = results.filter((r) => !r.success).length;
      if (failed) {
        toast.error(
          t("messages.addExercisesPartialFail", {
            fail: failed,
            total: results.length,
          })
        );
      } else {
        toast.success(
          t("messages.addExercisesSuccess", { count: results.length })
        );
      }
      /* refresh lesson */
      const updated = await lessonService.getById(id);
      if (updated.success) setLesson(updated.data);
      setShowExerciseModal(false);
      setSelectedExercises([]);
      setFilteredExercises([]);
    } catch {
      toast.error(t("messages.addExercisesError"));
    }
  };

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

  /* ─────────────── loading state ─────────────── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-lg font-medium">
        {t("messages.loading")}
      </div>
    );
  }

  /* ─────────────── UI ─────────────── */
  return (
    <div className="relative mt-8 rounded-lg shadow-md">
      <PaginationTable
        customObjects={lesson?.exercises || []}
        fields={fields}
        modalFields={modalField}
        service={exerciseService}
        breadcrumbs={breadcrumbs}
        onHandleFile={onHandleFile}
        hasCustomFetch
        /* add-existing button (responsive) */
        customActions={
          <button
            type="button"
            onClick={() => setShowExerciseModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {t("buttons.addExistingExercise")}
          </button>
        }
      />

      {/* ───────── modal ───────── */}
      {showExerciseModal && (
        <Modal
          isOpen={showExerciseModal}
          onClose={() => setShowExerciseModal(false)}
          title={t("modal.title")}
        >
          <div className="mt-4 min-h-[200px]">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <CustomSelector
                value={filters.type}
                objects={exerciseTypes}
                onChange={(val) => setFilters((f) => ({ ...f, type: val }))}
                placeholder={t("filters.type")}
                className="flex-1"
              />
              <CustomSelector
                value={filters.skill}
                objects={SkillOptions}
                onChange={(val) => setFilters((f) => ({ ...f, skill: val }))}
                placeholder={t("filters.skill")}
                className="flex-1"
              />
              <button
                onClick={fetchFilteredExercises}
                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
              >
                {t("buttons.filter")}
              </button>
            </div>

            {filteredExercises.length > 0 ? (
              <div className="overflow-x-auto max-h-[400px] ">
                <table className="table-auto w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2"></th>
                      <th className="p-2">{t("table.name")}</th>
                      <th className="p-2">{t("table.question")}</th>
                      <th className="p-2">{t("table.type")}</th>
                      <th className="p-2">{t("table.skill")}</th>
                      <th className="p-2">{t("table.level")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExercises.map((ex) => (
                      <tr key={ex.id} className="hover:bg-gray-50">
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedExercises.some(
                              (e) => e.id === ex.id
                            )}
                            onChange={(e) => {
                              setSelectedExercises((prev) =>
                                e.target.checked
                                  ? [...prev, ex]
                                  : prev.filter((item) => item.id !== ex.id)
                              );
                            }}
                          />
                        </td>
                        <td className="p-2">{ex?.name}</td>
                        <td className="p-2">{ex?.question}</td>
                        <td className="p-2">{ex?.type?.name}</td>
                        <td className="p-2">{ex?.skill}</td>
                        <td className="p-2">{ex?.level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm mt-2">
                {t("table.noResults")}
              </p>
            )}

            <div className="mt-4 flex justify-end">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={async () => {
                  await handleAttachExercisesToLesson(selectedExercises);
                  setSelectedExercises([]);
                  setFilters({ type: "", skill: "" });
                  setFilteredExercises([]);
                  setShowExerciseModal(false);
                }}
              >
                {t("buttons.addSelected")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
