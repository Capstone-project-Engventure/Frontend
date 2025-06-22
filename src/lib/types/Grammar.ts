import type { Exercise } from './exercise';

export interface Grammar {
  id?: number;
  lesson?: number,
  exercises: Exercise[];
}
