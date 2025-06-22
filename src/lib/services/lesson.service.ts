import { axiosInstance } from "../Api";
import { Lesson } from "../types/lesson";
import { BaseService } from "./base.service";


class LessonService extends BaseService<Lesson> {
  constructor() {
    super("lessons");
  }

  getAllByTopic(
    topicId: string,
    params?: { page?: number; pageSize?: number }
  ) {
    return axiosInstance.get("/lessons", {
      params: { topic: topicId, ...params },
    });
  }
  importByFile(file: File) {
    const formData = new FormData();
    console.log("it came here");

    formData.append("file", file);
    return axiosInstance.post("/lessons/import-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async getAllSpeakingLessons(
    params?: { page?: number; pageSize?: number }
  ) {
    const response = await axiosInstance.get("/lessons", {
      params: { type: "practice_speaking", ...params },
    });
    return response;
  }

  async getAllListeningLessons(
    params?: { page?: number; pageSize?: number }
  ) {
    const response = await axiosInstance.get("/lessons", {
      params: { type: "listening_practice", ...params },
    });
    return response;
  }

  async getAllGrammarLessons(
    params?: { page?: number; pageSize?: number }
  ) {
    const response = await axiosInstance.get("/lessons", {
      params: { type: "grammar_practice", ...params },
    });
    return response;
  }
}

export default LessonService;
