import useReadingStore from "@/lib/store/readingStore";
import useGrammarStore from "@/lib/store/grammarStore";
import useListeningStore from "@/lib/store/listeningStore";

const resetAllStores = () => {
    useReadingStore.setState({ lessons: [], hasFetched: false });
    useGrammarStore.setState({ lessons: [], hasFetched: false });
    useListeningStore.setState({ lessons: [], hasFetched: false });

    localStorage.removeItem("current-lesson");
};

export default resetAllStores;
