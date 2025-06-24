import useGrammarStore from "@/lib/store/grammarStore";
import useListeningStore from "@/lib/store/listeningStore";
import useReadingStore from "@/lib/store/readingStore";
import useSpeakingStore from "@/lib/store/speakingStore";
import useCourseStore from '@/lib/store/courseStore';

const resetAllStores = () => {
    localStorage.removeItem("current-lesson");
    localStorage.removeItem("ReadingPractice-storage");
    localStorage.removeItem("GrammarPractice-storage");
    localStorage.removeItem("ListeningPractice-storage");
    localStorage.removeItem("SpeakingPractice-storage");

    const stores = [
        useReadingStore,
        useGrammarStore,
        useListeningStore,
        useSpeakingStore,
        useCourseStore
    ];

    stores.forEach((store) => store.getState().reset());
};

export default resetAllStores;
