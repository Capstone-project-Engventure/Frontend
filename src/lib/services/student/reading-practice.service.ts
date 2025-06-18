import { useApi } from "../../Api";

class ReadingPracticeService {
    private api;

    constructor() {
        this.api = useApi();
    }

    async getAllReadingPractices() {
        try {
            const response = await this.api.get("/lessons", {
                params: { type: "reading_practice" },
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
                dataReading: response.data.readings,
            };

        } catch (error: any) {
            console.error("Error fetching reading detail:", error);
            return { success: false, data: null };
        }
    }
}

const readingPracticeService = new ReadingPracticeService();
export default readingPracticeService;
