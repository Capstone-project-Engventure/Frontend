export type Lesson = {
  id: number;
  title: string;
  level: string;
  description: string;
  topic?: number | null;
  topic_id?:string;
  exercises: []
};
