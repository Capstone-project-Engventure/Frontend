import { Lesson } from "@/lib/types/lesson";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReadingState {
    lessons: Lesson[];
    hasFetched: boolean;
    hasHydrated: boolean;
    setLessons: (data: Lesson[]) => void;
    setHasFetched: (value: boolean) => void;
    setHasHydrated: (value: boolean) => void;
}

const useReadingStore = create<ReadingState>()(
    persist(
        (set) => ({
            lessons: [],
            hasFetched: false,
            hasHydrated: false,
            setLessons: (data) => set({ lessons: data }),
            setHasFetched: (value) => set({ hasFetched: value }),
            setHasHydrated: (value) => set({ hasHydrated: value }),
        }),
        {
            name: 'ReadingPractice-storage',
            partialize: (state) => ({
                lessons: state.lessons,
                hasFetched: state.hasFetched,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);

export default useReadingStore;
