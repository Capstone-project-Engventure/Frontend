export type ExerciseOption = {
    key: string;
    option: string;
};

export type ExerciseType = {
    id: number;
    name: string;
    description: string;
};

export type Exercise = {
    id: number;
    name: string;
    question?: string | null;
    system_answer?: string | null;
    type_id?: number;
    type?: ExerciseType;
    level?: string;
    skill?: string;
    image?: string | null;
    lesson?: string | null;
    generated_by?: string;
    description?: string | null;
    audio_file?: string;
    audio_file_url?: string | null;
    options: ExerciseOption[] | any[];
    explanation?: string | null;
    reading?: {
        title: string;
        content: string;
    };
    // exercises?: any[];
};
