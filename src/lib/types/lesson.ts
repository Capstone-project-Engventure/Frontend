import type { Reading } from './reading';
import type { Exercise } from './exercise';

export type Topic = {
  id: string;
  title: string;
  description: string;
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
  image?: string;
  exercises?: Exercise[];
};
