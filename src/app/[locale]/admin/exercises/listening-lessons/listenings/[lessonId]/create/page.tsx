'use client';

import ListeningEditor from "@/app/[locale]/components/ListeningEditor";
import ExerciseService from "@/lib/services/exercise.service";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

const CreateListeningPage = () => {
  const exerciseService = new ExerciseService();
  const params = useParams();
  const lessonId = params.lessonId;
  
  const handleSave = async (data: any) => {
    console.log("Listening exercise submitted: ", data);
    try {
      // Handle FormData if it contains audio file
      if (data instanceof FormData) {
        const exerciseData = JSON.parse(data.get('data') as string);
        exerciseData.lesson = Number(lessonId);
        exerciseData.skill = "listening";
        exerciseData.generated_by = "admin";
        
        // Add all form data
        for (const [key, value] of data.entries()) {
          if (key !== 'data') {
            exerciseData[key] = value;
          }
        }
        
        await exerciseService.create(exerciseData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        // Handle regular data
        data.lesson = Number(lessonId);
        data.skill = "listening";
        data.generated_by = "admin";
        await exerciseService.create(data, {});
      }
      
      toast.success("Listening exercise created successfully");
    } catch (error) {
      console.error("Error creating listening exercise:", error);
      toast.error("Failed to create listening exercise, please try again!");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <ListeningEditor header="Add new listening exercise" onSubmit={handleSave} />
    </main>
  );
};

export default CreateListeningPage;
