import { ExerciseType } from "./exercise-type";
import { Reading } from "./reading";

export type ExerciseOption = {
    key: string;
    option: string;
};

export type Exercise = {
    id: number;
    name: string;
    question?: string | null;
    system_answer: string;
    type_id: number;
    type?: ExerciseType;
    reading?: Reading;
    level: string;
    skill: string;
    image: string | null;
    lesson?: string | null;
    topic?: string | null;
    generated_by: string;
    description: string;
    audio_file?: string | null;
    audio_file_url?: string | null;
    options: ExerciseOption[];
    explanation?: string | null;
    status?:"approved" | "pending" | "rejected";
    created_at?: string; 
    updated_at?: string;
};
