import { useApi } from "../Api";

class GrammarPracticeService {
    private api;

    constructor() {
        this.api = useApi();
    }

    async getAllGrammarPractices() {
        try {
            const response = await this.api.get("/lessons", {
                params: { type: "grammar_practice" },
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            console.error("Failed to fetch reading practices:", error);
            return { success: false, data: null };
        }
    }

    async getById(id: number) {
        try {
            const response = await this.api.get(`/lessons/${id}`);
            return {
                success: true,
                dataGrammar: response.data,
            };

        } catch (error: any) {
            console.error("Error fetching reading detail:", error);
            return { success: false, data: null };
        }
    }
}

const grammarPracticeService = new GrammarPracticeService();
export default grammarPracticeService;
