export type Exercise = {
    id: string;
    name: string;
    question: string;
    description: string;
    options: Record<string, string> | string[] | null;
    audio_file: string;
    system_answer: string;
    image: string | null;
    lesson?: string;
    skill?:string;
};
  