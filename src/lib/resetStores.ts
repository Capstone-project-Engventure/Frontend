import useReadingStore from "@/lib/store/readingStore";

export const resetAllStores = () => {
    const { setLessons, setHasFetched } = useReadingStore.getState();
    setLessons([]);
    setHasFetched(false);

    localStorage.removeItem("ReadingPractice-storage");
    localStorage.removeItem("current_lesson");
};
