import type { Exercise } from './exercise';

export type Reading = {
    id: number;
    title: string;
    content: string;
    exercises: Exercise[];
    lesson?: string|number;
};