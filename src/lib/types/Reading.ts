export interface Option {
  key: string;
  option: string;
}

export interface ExerciseType {
  id: number;
  name: string;
  description: string;
}

export interface Exercise {
  id: number;
  name: string;
  question?: string;
  system_answer?: string;
  type?: ExerciseType;
  type_id?: number;
  level?: string;
  skill?: string;
  image?: string | null;
  lesson?: any; // Hoặc thay bằng type cụ thể nếu bạn có
  generated_by?: string;
  description?: string;
  options: Option[];
  explanation?: string | null;
  audio_file?: string | null;
  audio_file_url?: string;
}

export interface Reading {
  id: number;
  lesson?: number,
  title: string;
  content: string;
  exercises: Exercise[];
}
