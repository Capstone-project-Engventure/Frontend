'use client';

import WritingEditor from "@/app/[locale]/components/WritingEditor";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import ExerciseService from "@/lib/services/exercise.service";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslations, useLocale } from "next-intl";

const CreateWritingPage = () => {
  const exerciseService = new ExerciseService();
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const lessonId = params.lessonId;
  const tWriting = useTranslations("Admin.WritingLessons");
  
  const breadcrumbs = [
    { label: tWriting("breadcrumbs.home"), href: `/${locale}/admin/home` },
    { label: tWriting("breadcrumbs.exercises"), href: `/${locale}/admin/exercises` },
    { 
      label: tWriting("breadcrumbs.writingLessons"), 
      href: `/${locale}/admin/exercises/writing-lessons` 
    },
    { 
      label: tWriting("breadcrumbs.writings"), 
      href: `/${locale}/admin/exercises/writing-lessons/writing/${lessonId}` 
    },
    { label: tWriting("breadcrumbs.createWriting") }
  ];
  
  const handleSave = async (data: Partial<any>) => {
    console.log("Writing exercise submitted: ", data);
    try {
      data.lesson = Number(lessonId);
      data.skill = "writing";
      await exerciseService.create(data, {});
      toast.success(tWriting("messages.createExerciseSuccess"));
      
      // Navigate back to writing exercises list
      router.push(`/${locale}/admin/exercises/writing-lessons/writing/${lessonId}`);
    } catch (error) {
      toast.error(tWriting("messages.createExerciseError"));
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbs} />
      </div>
      <WritingEditor header={tWriting("headers.addNew")} onSubmit={handleSave} />
    </main>
  );
};

export default CreateWritingPage;
