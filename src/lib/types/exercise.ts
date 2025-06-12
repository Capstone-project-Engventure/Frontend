export type Exercise = {
  id: string;
  name: string;
  question: string;
  description: string;
  options: Record<string, string> | string[] | null;
  audio_file: string;
  system_answer: string;
  image: string | null;
  lesson?: string | null;
  skill?: string;
  type?: null;
  type_id?: null;
  level?: string | null;
  generated_by?: string | null;
  audio_file_url?: string | null;
  reading: unknown;
};
