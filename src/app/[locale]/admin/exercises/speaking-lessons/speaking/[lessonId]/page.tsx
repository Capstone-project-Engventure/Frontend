"use client";

import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import { LevelOptions } from "@/lib/constants/level";
import { SkillOptions } from "@/lib/constants/skill";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Exercise } from "@/lib/types/exercise";
import { Lesson } from "@/lib/types/lesson";
import { OptionType } from "@/lib/types/option";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function AdminSpeakingExercises() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const lessonId = params.lessonId as string;

    const safeRender = (value: any) => {
        if (value === null || value === undefined) return "N/A";
        if (typeof value === "string" || typeof value === "number") return String(value);
        if (typeof value === "boolean") return value ? "Yes" : "No";

        if (Array.isArray(value)) {
            if (value.length === 0) return "No items";
            if (typeof value[0] === "object" && value[0]?.key && value[0]?.option) {
                return (
                    <ul className="list-disc list-inside text-xs">
                        {value.map((opt: { key: string; option: string }, index: number) => (
                            <li key={opt.key || index}>
                                <strong>{opt.key?.toUpperCase()}:</strong> {opt.option}
                            </li>
                        ))}
                    </ul>
                );
            }
            return value.join(", ");
        }

        if (typeof value === "object") {
            if (value.name) return value.name;
            if (value.title) return value.title;
            if (value.label) return value.label;
            const jsonStr = JSON.stringify(value);
            return jsonStr.length > 100 ? jsonStr.substring(0, 100) + "..." : jsonStr;
        }

        return String(value);
    };

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [topics, setTopics] = useState<OptionType[]>([]);
    const [lessons, setLessons] = useState<OptionType[]>([]);
    const [exerciseTypes, setExerciseTypes] = useState<OptionType[]>([]);
    const [topic, setTopic] = useState<OptionType | null>(null);

    const locale = useLocale();
    const t = useTranslations("Admin.Exercises");
    const exerciseService = new ExerciseService();
    const topicService = new TopicService();
    const lessonService = new LessonService();
    const exerciseTypeService = new ExerciseTypeService();

    const breadcrumbs = [
        { label: t("breadcrumbs.home"), href: `${locale}/admin/home` },
        {
            label: t("breadcrumbs.speakingExercises"),
            href: `/${locale}/admin/exercises/speaking-lessons`,
        },
        {
            label: currentLesson?.title || `Lesson ${lessonId}`,
            href: pathname,
        },
    ];

    const fields = useMemo(() => [
        {
            key: "name",
            label: t("fields.name"),
            render: (value: any, item: any) => (
                <Link
                    href={`/${locale}/admin/exercises/speaking-lessons/speaking/${lessonId}/view/${item.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {value || "N/A"}
                </Link>
            ),
        },
        { key: "question", label: t("fields.question"), render: safeRender },
        { key: "level", label: t("fields.level"), render: safeRender },
        { key: "options", label: t("fields.options"), render: safeRender },
        { key: "audio", label: t("fields.audio"), render: safeRender },
        { key: "system_answer", label: t("fields.answer"), render: safeRender },
    ], [t, locale, lessonId]);

    const modalFields = useMemo(() => [
        { key: "name", label: t("fields.name"), type: "text" },
        { key: "question", label: t("fields.question"), type: "textarea" },
        {
            key: "type_id",
            label: t("fields.questionType"),
            type: "select",
            options: exerciseTypes || [],
        },
        { key: "level", label: t("fields.level"), type: "select", options: LevelOptions },
        { key: "description", label: t("fields.description"), type: "textarea" },
        { key: "system_answer", label: t("fields.answer"), type: "text" },
        { key: "explanation", label: t("fields.explanation"), type: "textarea" },
        {
            key: "options",
            label: t("fields.options"),
            type: "textarea",
            placeholder:
                'JSON format: [{"key": "A", "option": "Answer A"}, {"key": "B", "option": "Answer B"}]',
        },
        {
            key: "audio",
            label: t("fields.audioFile"),
            type: "file",
            accept: "audio/*",
        },
        {
            key: "skill",
            label: t("fields.skill"),
            type: "select",
            options: SkillOptions,
            default: "speaking",
        },
        { key: "lesson", label: "", type: "hidden", default: lessonId },
        { key: "generated_by", label: "", type: "hidden", default: "admin" },
    ], [t, exerciseTypes, lessonId]);

    const fetchExercises = useCallback(async () => {
        try {
            const filters: Record<string, unknown> = {
                lesson: lessonId,
                skill: "speaking",
            };

            const res = await exerciseService.getAll({ page, pageSize, filters });
            if (res.success) {
                setExercises(res.data || []);
                setTotalPage(res.pagination?.total_page ?? 1);
            } else {
                toast.error("Failed to fetch exercises");
                setExercises([]);
            }
        } catch (e) {
            console.error(e);
            toast.error("Network error while fetching exercises");
            setExercises([]);
        }
    }, [lessonId, page, pageSize]);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    useEffect(() => {
        (async () => {
            try {
                const [tpRes, lsRes, etRes] = await Promise.all([
                    topicService.getAll(),
                    lessonService.getAll(),
                    exerciseTypeService.getAll(),
                ]);

                if (tpRes.success) {
                    setTopics(tpRes.data.map((v: any) => ({ value: v.id, label: v.title })));
                } else toast.error("Failed to fetch topics");

                if (lsRes.success) {
                    setLessons(lsRes.data.map((v: any) => ({ value: v.id, label: v.title })));
                } else toast.error("Failed to fetch lessons");

                if (etRes.success) {
                    setExerciseTypes(etRes.data.map((v: any) => ({ value: v.id, label: v.name })));
                } else toast.error("Failed to fetch exercise types");
            } catch (e) {
                console.error(e);
                toast.error("Network error");
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (lessonId) {
                try {
                    const res = await lessonService.getById(lessonId);
                    if (res.success) {
                        setCurrentLesson(res.data);
                    }
                } catch (e) {
                    console.error("Error fetching lesson:", e);
                }
            }
        })();
    }, [lessonId]);

    const onPageChange = (page: number) => setPage(page);

    const onCreate = useCallback(() => router.push(`${pathname}/create`), [pathname, router]);
    const onEdit = useCallback((item: any) => router.push(`${pathname}/edit/${item.id}`), [pathname, router]);
    const onView = useCallback((item: any) => router.push(`${pathname}/view/${item.id}`), [pathname, router]);

    const handleAdd = async (data: any) => {
        try {
            const exerciseData = {
                ...data,
                lesson: lessonId,
                skill: "speaking",
                generated_by: "admin",
            };

            if (exerciseData.options && typeof exerciseData.options === "string") {
                try {
                    exerciseData.options = JSON.parse(exerciseData.options);
                } catch {
                    toast.error("Invalid JSON format for options");
                    return;
                }
            }

            const response = await exerciseService.create(exerciseData, {});
            if (response.success) {
                toast.success("Exercise created successfully");
                fetchExercises();
            } else {
                toast.error("Failed to create exercise");
            }
        } catch (error) {
            console.error("Error creating exercise:", error);
            toast.error("Network error while creating exercise");
        }
    };

    const handleUpdate = async (id: string | number, data: any) => {
        try {
            const exerciseData = {
                ...data,
                lesson: lessonId,
                skill: "speaking",
            };

            if (exerciseData.options && typeof exerciseData.options === "string") {
                try {
                    exerciseData.options = JSON.parse(exerciseData.options);
                } catch {
                    toast.error("Invalid JSON format for options");
                    return;
                }
            }

            const response = await exerciseService.update(Number(id), exerciseData, {});
            if (response.success) {
                toast.success("Exercise updated successfully");
                fetchExercises();
            } else {
                toast.error("Failed to update exercise");
            }
        } catch (error) {
            console.error("Error updating exercise:", error);
            toast.error("Network error while updating exercise");
        }
    };

    const handleDelete = async (id: string | number) => {
        try {
            const response = await exerciseService.delete(Number(id));
            if (response.success) {
                toast.success("Exercise deleted successfully");
                fetchExercises();
            } else {
                toast.error("Failed to delete exercise");
            }
        } catch (error) {
            console.error("Error deleting exercise:", error);
            toast.error("Network error while deleting exercise");
        }
    };

    return (
        <div className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
            <Breadcrumb items={breadcrumbs} />
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                    {currentLesson?.title || `Lesson ${lessonId}`} - Speaking Exercises
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {currentLesson?.description || "Manage speaking exercises for this lesson"}
                </p>
            </div>

            <AdvancedDataTable
                fields={fields}
                customObjects={exercises}
                customTotalPages={totalPage}
                page={page}
                onPageChange={onPageChange}
                // modalTitle="Speaking Exercise"
                // modalFields={modalFields}
                hasCustomFetch={true}
                onCreate={onCreate}
                onEdit={onEdit}
                onView={onView}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onSuccess={fetchExercises}
            />
        </div>
    );
}
