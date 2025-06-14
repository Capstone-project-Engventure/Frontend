import useReadingStore from "@/lib/store/readingStore";

const resetAllStores = () => {
    ["ReadingPractice-storage", "current_lesson"].forEach(localStorage.removeItem);

    useReadingStore.setState({
        lessons: [],
        hasFetched: false,
    });
};

export default resetAllStores;
