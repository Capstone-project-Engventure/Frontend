// src/lib/stores/readingStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lesson } from "@/lib/types/lesson";

interface ReadingState {
    lessons: Lesson[];
    setLessons: (data: Lesson[]) => void;
    hasFetched: boolean;
    setHasFetched: (value: boolean) => void;
}

const useReadingStore = create<ReadingState>()(
    persist(
        (set) => ({
            lessons: [],
            hasFetched: false,
            setLessons: (data) => set({ lessons: data }),
            setHasFetched: (value) => set({ hasFetched: value }),
        }),
        {
            name: 'ReadingPractice-storage', // tên key trong localStorage
            partialize: (state) => ({
                lessons: state.lessons,
                hasFetched: state.hasFetched,
            }),
        }
    )
);

export default useReadingStore;
