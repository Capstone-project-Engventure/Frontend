import { Lesson, Topic } from "./lesson";

export type Section = {
  id: number,
  name: string,
  topic?: Topic | null;
  lessons: Lesson[];
}

export type Course = {
  id: string;
  name: string;
  scope: string;
  description: string;
  sections: Section[];
  teacher?: string;
  begin: Date;
  end: Date;
};
