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

  async checkPronunciation({ audio, exercise }: { audio: File; exercise: any }) {
    const formData = new FormData();
    formData.append("audio", audio);
    formData.append("exercise", exercise);

    return api.post("/exercises/check-pronunciation", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  // Approve service - check if exercise already exists in database
  async checkExerciseExists(exerciseData: Partial<Exercise>) {
    try {
      const response = await api.post("exercises/check-exists", exerciseData);
      return response.data;
    } catch (error) {
      console.error("Error checking exercise existence:", error);
      throw error;
    }
  }

  // Approve service - approve and save exercise to database
  async approveExercise(exerciseData: Exercise) {
    try {
      const response = await api.post("exercises/approve", exerciseData);
      return response.data;
    } catch (error) {
      console.error("Error approving exercise:", error);
      throw error;
    }
  }

  // Approve service - get all pending exercises for approval
  async getPendingExercises() {
    try {
      const response = await api.get("exercises/pending");
      return response.data;
    } catch (error) {
      console.error("Error fetching pending exercises:", error);
      throw error;
    }
  }

  // Approve service - reject exercise
  async rejectExercise(exerciseId: string, reason?: string) {
    try {
      const response = await api.post(`exercises/${exerciseId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error("Error rejecting exercise:", error);
      throw error;
    }
  }
}

export default ExerciseService;
