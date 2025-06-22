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

class PronunciationPracticeService extends BaseService<Lesson> {
  constructor() {
    super("pronunciation-exercises");
  }

  importByFile(file: File) {
    const formData = new FormData();
    console.log("it came here");

    formData.append("file", file);
    return api.post("/pronunciation-exercises/import-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  checkPronunciation(data:any) {
    return api.post("/pronunciation-exercises/check-pronunciation", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default PronunciationPracticeService;
