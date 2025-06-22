import { useApi } from "../Api";
import { Lesson } from "../types/lesson";
import { Reading } from "../types/reading";
import { BaseService } from "./base.service";

const api = useApi();

interface ApiResponse<T> {
	success: boolean;
	data: T | string;
	current_page?: number;
	total_page?: number;
}

class GrammarService extends BaseService<Reading> {
	constructor() {
		super("grammars");
	}

	getAllByTopic(
		topicId: string,
		params?: { page?: number; pageSize?: number }
	) {
		return api.get("/grammars", {
			params: { topic: topicId, ...params },
		});
	}
}

export default GrammarService;
