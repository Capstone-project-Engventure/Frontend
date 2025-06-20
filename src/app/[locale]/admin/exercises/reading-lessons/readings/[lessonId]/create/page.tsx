'use client';

import ReadingEditor from "@/app/[locale]/components/ReadingEditor";
import ReadingService from "@/lib/services/reading.service";
import { Reading } from "@/lib/types/reading";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

const CreateReadingPage = () => {
    const readingService = new ReadingService();
    const params = useParams();
    const lessonId = params.lessonId;
    const handleSave = async (data: Reading) => {
      console.log("Reading submitted:", data);
      try {
        data.lesson = Number(lessonId)
        await readingService.create(data, {})
        toast.success("Update reading successfully")
      } catch (error) {
        toast.success("Update reading failure, please try again!")
      }
    };

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <ReadingEditor header="Add new reading" onSubmit={handleSave} />
        </main>
    );
};

export default CreateReadingPage;
