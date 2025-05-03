export type Lesson = {
  id: number;
  title: string;
  level: string;
  description: string;
  topic?: number | null;
  exercises: []
};
