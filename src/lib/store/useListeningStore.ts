// src/lib/stores/readingStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lesson } from "@/lib/types/lesson";

interface LessonState {
    lessons: Lesson[];
    setLessons: (data: Lesson[]) => void;
    hasFetched: boolean;
    setHasFetched: (value: boolean) => void;
}

const useListenStore = create<LessonState>()(
    persist(
        (set) => ({
            lessons: [],
            hasFetched: false,
            setLessons: (data) => set({ lessons: data }),
            setHasFetched: (value) => set({ hasFetched: value }),
        }),
        {
            name: 'listening-storage', // tên key trong localStorage
            partialize: (state) => ({
                lessons: state.lessons,
                hasFetched: state.hasFetched,
            }),
        }
    )
);

export default useListenStore;
