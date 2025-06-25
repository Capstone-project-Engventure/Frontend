'use client';

import SpeakingEditor from "@/app/[locale]/components/SpeakingEditor";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { Button } from "@/app/[locale]/components/ui/Button";
import ExerciseService from "@/lib/services/exercise.service";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CreateSpeakingPage = () => {
  const exerciseService = new ExerciseService();
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const lessonId = params.lessonId;
  const tSpeaking = useTranslations("Admin.SpeakingLessons");

  const breadcrumbs = [
    { label: tSpeaking("breadcrumbs.home"), href: `/${locale}/admin/home` },
    { label: tSpeaking("breadcrumbs.exercises"), href: `/${locale}/admin/exercises` },
    {
      label: tSpeaking("breadcrumbs.speakingLessons"),
      href: `/${locale}/admin/exercises/speaking-lessons`
    },
    {
      label: tSpeaking("breadcrumbs.speakings"),
      href: `/${locale}/admin/exercises/speaking-lessons/speaking/${lessonId}`
    },
    { label: tSpeaking("breadcrumbs.createSpeaking") }
  ];

  const handleSave = async (data: Partial<any>) => {
    console.log("Speaking exercise submitted: ", data);
    try {
      data.lesson = Number(lessonId);
      data.skill = "speaking";
      await exerciseService.create(data, {});
      toast.success(tSpeaking("messages.createExerciseSuccess"));

      // Navigate back to speaking exercises list
      router.push(`/${locale}/admin/exercises/speaking-lessons/speaking/${lessonId}`);
    } catch (error) {
      toast.error(tSpeaking("messages.createExerciseError"));
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbs} />
        <div className="my-4">
          <Button
            onClick={() => router.back()}
            variant="default"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
        </div>
      </div>
      <SpeakingEditor header={tSpeaking("headers.addNew")} onSubmit={handleSave} />
    </main>
  );
};

export default CreateSpeakingPage;
