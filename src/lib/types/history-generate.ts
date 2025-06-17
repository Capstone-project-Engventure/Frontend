import { Exercise } from "./exercise";

export interface GenerateHistory {
  id: number;
  timestamp: string;
  params: Record<string, any>;
  response: {
    exercises: Exercise[];
    history_id: number;
  };
  created_exercises: number[];
}