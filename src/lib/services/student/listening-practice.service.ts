import { useApi } from "../../Api";

class ListeningPracticeService {
    private api;

    constructor() {
        this.api = useApi();
    }

    async getAllListeningPractices() {
        try {
            const response = await this.api.get("/lessons", {
                params: { type: "listening_practice" },
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            console.error("Failed to fetch getAllListeningPractices: ", error);
            return { success: false, data: null };
        }
    }

    async getById(id: number) {
        try {
            const response = await this.api.get(`/lessons/${id}`);
            return {
                success: true,
                dataListening: response.data,
            };

        } catch (error: any) {
            console.error("Error fetching reading detail:", error);
            return { success: false, data: null };
        }
    }
}

const listeningPracticeService = new ListeningPracticeService();
export default listeningPracticeService;
