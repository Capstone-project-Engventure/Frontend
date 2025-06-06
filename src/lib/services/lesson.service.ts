import { useApi } from "../Api";
import { Lesson } from "../types/lesson";
import { BaseService } from "./base.service";

const api = useApi();

interface ApiResponse<T> {
  success: boolean;
  data: T | string;
  current_page?: number;
  total_page?: number;
}

class LessonService extends BaseService<Lesson> {
  constructor() {
    super("lessons");
  }

  getAllByTopic(
    topicId: string,
    params?: { page?: number; pageSize?: number }
  ) {
    return api.get("/lessons", {
      params: { topic: topicId, ...params },
    });
  }
  importByFile(file: File) {
    const formData = new FormData();
    console.log("it came here");

    formData.append("file", file);
    return api.post("/lessons/import-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default LessonService;
