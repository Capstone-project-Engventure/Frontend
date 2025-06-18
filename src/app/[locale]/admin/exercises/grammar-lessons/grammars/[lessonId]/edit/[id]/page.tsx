'use client';

import GrammarEditor from "@/app/[locale]/components/GrammarEditor";
import ReadingService from "@/lib/services/reading.service";
import { Reading } from "@/lib/types/Reading";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

const CreateGrammarPage = () => {
    const readingService = new ReadingService();
    const params = useParams();
    const id = params.id;
    const handleSave = async (data: Reading) => {
      console.log("Reading submitted:", data);
      try {
        await readingService.update(data.id, data, {})
        toast.success("Update reading successfully")
      } catch (error) {
        toast.success("Update reading failure, please try again!")
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

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <GrammarEditor header="Edit reading content" initialData={reading} onSubmit={handleSave} />
        </main>
    );
};

export default CreateGrammarPage;
