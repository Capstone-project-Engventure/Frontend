import useReadingStore from "@/lib/store/readingStore";
import useGrammarStore from "@/lib/store/grammarStore";

const resetAllStores = () => {
    useReadingStore.setState({ lessons: [], hasFetched: false });
    useGrammarStore.setState({ lessons: [], hasFetched: false });

    localStorage.removeItem("current-lesson");
};

export default resetAllStores;
