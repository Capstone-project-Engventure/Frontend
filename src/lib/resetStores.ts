import useReadingStore from "@/lib/store/readingStore";
import useGrammarStore from "@/lib/store/grammarStore";
import useListeningStore from "@/lib/store/listeningStore";

const resetAllStores = () => {
    useReadingStore.getState().reset();
    useGrammarStore.getState().reset();
    useListeningStore.getState().reset();

    localStorage.removeItem("current-lesson");
};

export default resetAllStores;
