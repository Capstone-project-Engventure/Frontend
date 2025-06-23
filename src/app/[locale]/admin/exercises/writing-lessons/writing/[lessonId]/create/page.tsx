'use client';

import WritingEditor from "@/app/[locale]/components/WritingEditor";
import ExerciseService from "@/lib/services/exercise.service";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

const CreateWritingPage = () => {
  const exerciseService = new ExerciseService();
  const params = useParams();
  const lessonId = params.lessonId;
  
  const handleSave = async (data: Partial<any>) => {
    console.log("Writing exercise submitted: ", data);
    try {
      data.lesson = Number(lessonId)
      data.skill = "writing"
      await exerciseService.create(data, {})
      toast.success("Create writing exercise successfully")
    } catch (error) {
      toast.error("Create writing exercise failure, please try again!")
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <WritingEditor header="Add new writing exercise" onSubmit={handleSave} />
    </main>
  );
};

export default CreateWritingPage;
