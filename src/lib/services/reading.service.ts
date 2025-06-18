import { useApi } from "../Api";
import { Lesson } from "../types/lesson";
import { Reading } from "../types/Reading";
import { BaseService } from "./base.service";

const api = useApi();

interface ApiResponse<T> {
	success: boolean;
	data: T | string;
	current_page?: number;
	total_page?: number;
}

class ReadingService extends BaseService<Reading> {
	constructor() {
		super("readings");
	}

	getAllByTopic(
		topicId: string,
		params?: { page?: number; pageSize?: number }
	) {
		return api.get("/readings", {
			params: { topic: topicId, ...params },
		});
	}
}

export default ReadingService;
