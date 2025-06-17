import { extend } from "lodash";
import { useApi } from "../Api";
import { Exercise } from "../types/exercise";
import { BaseService } from "./base.service";

const api = useApi();

class ExerciseService extends BaseService<Exercise> {
  constructor() {
    super("exercises");
  }

  importByFile(file: File) {
    const formData = new FormData();
    console.log("it came here");

    formData.append("file", file);
    return api.post("exercises/import-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  submitExercise(exerciseId: string, content: string) {
    return api.post(`exercises/${exerciseId}/submit`, { content });
  }

  async checkPronunciation({ audio, exercise }) {
    const formData = new FormData();
    formData.append("audio", audio);
    formData.append("exercise", exercise);

    return api.post("/exercises/check-pronunciation", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

export default ExerciseService;
