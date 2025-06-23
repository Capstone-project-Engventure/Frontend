'use client';

import SpeakingEditor from "@/app/[locale]/components/SpeakingEditor";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import ExerciseService from "@/lib/services/exercise.service";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslations, useLocale } from "next-intl";

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
      </div>
      <SpeakingEditor header={tSpeaking("headers.addNew")} onSubmit={handleSave} />
    </main>
  );
};

export default CreateSpeakingPage;
