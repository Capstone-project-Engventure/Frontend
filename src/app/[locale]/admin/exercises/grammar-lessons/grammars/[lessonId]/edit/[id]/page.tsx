'use client';

import GrammarEditor from "@/app/[locale]/components/GrammarEditor";
import ReadingService from "@/lib/services/reading.service";
import { Reading } from "@/lib/types/reading";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { Exercise } from "@/lib/types/exercise"; 

const CreateGrammarPage = () => {
    const readingService = new ReadingService();
    const params = useParams();
    const id = params.id;
    // Make sure this import exists
    
    const handleSave = async (data: Exercise) => {
      if (!reading) return;
      const updatedReading = {
        ...reading,
        exercises: reading.exercises?.map((ex) =>
          ex.id === data.id ? { ...ex, ...data } : ex
        ),
      };
      try {
        await readingService.update(updatedReading.id, updatedReading, {});
        toast.success("Update reading successfully");
        setReading(updatedReading);
      } catch (error) {
        toast.error("Update reading failure, please try again!");
      }
    };

    const [reading, setReading] = useState<Reading>();
    const fetchReading = useCallback(async () => {
        const res = await readingService.getById(id as string);
        if (res.success) {
          setReading(res?.data);
        } else {
          toast.error("Failed to fetch lesson");
        }
      }, []);

      useEffect(() => void fetchReading(), []);

    // Convert Reading to Grammar, ensuring exercises.question is string | undefined (not null)
    // and audio_file_url is string | undefined (not null)
    const grammarData = reading
        ? {
            ...reading,
            exercises: reading.exercises?.map((ex) => ({
                ...ex,
                question: ex.question ?? '', // convert null to empty string
                audio_file_url: ex.audio_file_url ?? undefined, // convert null to undefined
            })),
        }
        : undefined;

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <GrammarEditor header="Edit reading content" initialData={grammarData} onSubmit={handleSave} />
        </main>
    );
};

export default CreateGrammarPage;
