import type { Exercise } from './exercise';

export interface Speaking {
  id?: number;
  lesson?: number;
  exercises: Exercise[];
} 