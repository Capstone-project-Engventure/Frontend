import { Lesson } from "./lesson";

export type Course = {
  id: string;
  name: string;
  scope: string;
  description: string;
  lessons: Lesson[];
  teacher?: string;
  begin: Date;
  end: Date;
};
