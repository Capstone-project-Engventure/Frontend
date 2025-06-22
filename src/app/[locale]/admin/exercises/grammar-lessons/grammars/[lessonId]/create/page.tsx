'use client';

import GrammarEditor from "@/app/[locale]/components/GrammarEditor";
import GrammarService from "@/lib/services/exercise.service";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

const CreateGrammarPage = () => {
  const grammarService = new GrammarService();
  const params = useParams();
  const lessonId = params.lessonId;
  const handleSave = async (data: Partial<any>) => {
    console.log("Reading submitted: ", data);
    try {
      data.lesson = Number(lessonId)
      await grammarService.create(data, {})
      toast.success("Update reading successfully")
    } catch (error) {
      toast.success("Update reading failure, please try again!")
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <GrammarEditor header="Add new grammar exercise" onSubmit={handleSave} />
    </main>
  );
};

export default CreateGrammarPage;
