import type { Reading } from './reading';
import type { Exercise } from './exercise';

export type Topic = {
  id: number;
  title: string;
  description?: string | null;
  category?: string;
  order?: number | null;
};

export type Lesson = {
  id: number;
  title: string;
  level: string;
  description: string;
  type: string;
  topic?: Topic | null;
  course_id?: number | null;
  topic_id?: string | null;
  readings: Reading[];
  image?: string | null;
  exercises?: Exercise[];
  // status?: 'draft' | 'published' | 'archived'; // 🆕 NEW
  created_at?: string;
  updated_at?: string;
  video?: string | null;
};
