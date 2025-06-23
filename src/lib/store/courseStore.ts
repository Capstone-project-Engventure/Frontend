import { Course } from "@/lib/types/course";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CourseState {
    courses: Course[];
    hasFetched: boolean;
    hasHydrated: boolean;
    setCourses: (data: Course[]) => void;
    setHasFetched: (value: boolean) => void;
    setHasHydrated: (value: boolean) => void;
    reset: () => void;
}

const useCourseStore = create<CourseState>()(
    persist(
        (set) => ({
            courses: [],
            hasFetched: false,
            hasHydrated: false,
            setCourses: (data) => set({ courses: data }),
            setHasFetched: (value) => set({ hasFetched: value }),
            setHasHydrated: (value) => set({ hasHydrated: value }),
            reset: () => set({ courses: [], hasFetched: false })
        }),
        {
            name: 'Course-storage',
            partialize: (state) => ({
                courses: state.courses,
                hasFetched: state.hasFetched,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);

export default useCourseStore;
