import useReadingStore from "@/lib/store/readingStore";
import useGrammarStore from "@/lib/store/grammarStore";
import useListeningStore from "@/lib/store/listeningStore";
import useSpeakingStore from "@/lib/store/speakingStore";
import useAdminGrammarStore from "@/lib/store/adminGrammarStore";
import useAdminListeningStore from "@/lib/store/adminListeningStore";
import useAdminSpeakingStore from "@/lib/store/adminSpeakingStore";
import useAdminWritingStore from "@/lib/store/adminWritingStore";
import useAdminReadingStore from "@/lib/store/adminReadingStore";

const resetAllStores = () => {
    // Student stores
    useReadingStore.getState().reset();
    useGrammarStore.getState().reset();
    useListeningStore.getState().reset();
    useSpeakingStore.getState().reset();
    
    // Admin stores
    useAdminGrammarStore.getState().reset();
    useAdminListeningStore.getState().reset();
    useAdminSpeakingStore.getState().reset();
    useAdminWritingStore.getState().reset();
    useAdminReadingStore.getState().reset();

    localStorage.removeItem("current-lesson");
};

export default resetAllStores;
