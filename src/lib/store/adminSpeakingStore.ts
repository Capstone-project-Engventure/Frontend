import { Lesson } from "@/lib/types/lesson";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminSpeakingState {
    lessons: Lesson[];
    hasFetched: boolean;
    hasHydrated: boolean;
    currentLesson: Lesson | null;
    setLessons: (data: Lesson[]) => void;
    setHasFetched: (value: boolean) => void;
    setHasHydrated: (value: boolean) => void;
    setCurrentLesson: (lesson: Lesson | null) => void;
    addLesson: (lesson: Lesson) => void;
    updateLesson: (id: number, data: Partial<Lesson>) => void;
    deleteLesson: (id: number) => void;
    reset: () => void;
}

const useAdminSpeakingStore = create<AdminSpeakingState>()(
    persist(
        (set, get) => ({
            lessons: [],
            hasFetched: false,
            hasHydrated: false,
            currentLesson: null,
            setLessons: (data) => set({ lessons: data }),
            setHasFetched: (value) => set({ hasFetched: value }),
            setHasHydrated: (value) => set({ hasHydrated: value }),
            setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
            addLesson: (lesson) => set((state) => ({ 
                lessons: [...state.lessons, lesson] 
            })),
            updateLesson: (id, data) => set((state) => ({
                lessons: state.lessons.map(lesson => 
                    lesson.id === id ? { ...lesson, ...data } : lesson
                ),
                currentLesson: state.currentLesson?.id === id 
                    ? { ...state.currentLesson, ...data } 
                    : state.currentLesson
            })),
            deleteLesson: (id) => set((state) => ({
                lessons: state.lessons.filter(lesson => lesson.id !== id),
                currentLesson: state.currentLesson?.id === id ? null : state.currentLesson
            })),
            reset: () => set({ 
                lessons: [], 
                hasFetched: false, 
                hasHydrated: false,
                currentLesson: null 
            }),
        }),
        {
            name: 'admin-speaking-store',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHasHydrated(true);
                }
            },
        }
    )
);

export default useAdminSpeakingStore; 