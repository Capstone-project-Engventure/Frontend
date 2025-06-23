import useGrammarStore from "@/lib/store/grammarStore";
import useListeningStore from "@/lib/store/listeningStore";
import useReadingStore from "@/lib/store/readingStore";
import useSpeakingStore from "@/lib/store/speakingStore";
import useCourseStore from '@/lib/store/courseStore';

const resetAllStores = () => {
    const stores = [
        useReadingStore,
        useGrammarStore,
        useListeningStore,
        useSpeakingStore,
        useCourseStore
    ];

    stores.forEach((store) => store.getState().reset());
    localStorage.removeItem("current-lesson");
};

export default resetAllStores;
