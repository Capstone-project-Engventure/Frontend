import type { Exercise } from './exercise';

export interface Writing {
  id?: number;
  lesson?: number,
  exercises: Exercise[];
} 