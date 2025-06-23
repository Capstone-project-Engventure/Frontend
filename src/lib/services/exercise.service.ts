import { axiosInstance } from "../Api";
import { Exercise } from "../types/exercise";
import { BaseService } from "./base.service";
import { MutationResult, GetSingleResult, GetAllResult } from "../types/api";

class ExerciseService extends BaseService<Exercise> {
  constructor() {
    super("exercises");
  }

  async importByFile(file: File): Promise<MutationResult<any>> {
    try {
      const formData = new FormData();
      console.log("it came here");

      formData.append("file", file);
      const res = await axiosInstance.post("exercises/import-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        return {
          success: true,
          data: res.data,
        };
      }
      return {
        success: false,
        error: `HTTP Error: ${res.status}`,
        code: res.status.toString(),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  async submitExercise(exerciseId: string, content: string): Promise<MutationResult<any>> {
    try {
      const res = await axiosInstance.post(`exercises/${exerciseId}/submit`, { content });
      if (res.status === 200 || res.status === 201) {
        return {
          success: true,
          data: res.data,
        };
      }
      return {
        success: false,
        error: `HTTP Error: ${res.status}`,
        code: res.status.toString(),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  async checkPronunciation({ audio, exercise }: { audio: File; exercise: any }): Promise<MutationResult<any>> {
    try {
      const formData = new FormData();
      formData.append("audio", audio);
      formData.append("exercise", exercise);

      const res = await axiosInstance.post("/exercises/check-pronunciation", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 || res.status === 201) {
        return {
          success: true,
          data: res.data,
        };
      }
      return {
        success: false,
        error: `HTTP Error: ${res.status}`,
        code: res.status.toString(),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  // Approve service - check if exercise already exists in database
  async checkExerciseExists(exerciseData: Partial<Exercise>): Promise<GetSingleResult<any>> {
    try {
      const res = await axiosInstance.post("exercises/check-exists", exerciseData);
      if (res.status === 200) {
        return {
          success: true,
          data: res.data,
        };
      }
      return {
        success: false,
        error: `HTTP Error: ${res.status}`,
        code: res.status.toString(),
      };
    } catch (error: any) {
      console.error("Error checking exercise existence:", error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  // Approve service - approve and save exercise to database
  async approveExercise(exerciseData: Exercise): Promise<MutationResult<Exercise>> {
    try {
      const res = await axiosInstance.post("exercises/approve", exerciseData);
      if (res.status === 200 || res.status === 201) {
        return {
          success: true,
          data: res.data,
        };
      }
      return {
        success: false,
        error: `HTTP Error: ${res.status}`,
        code: res.status.toString(),
      };
    } catch (error: any) {
      console.error("Error approving exercise:", error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  // Approve service - get all pending exercises for approval
  async getPendingExercises(): Promise<GetAllResult<Exercise>> {
    try {
      const res = await axiosInstance.get("exercises/pending");
      if (res.status === 200) {
        return {
          success: true,
          data: Array.isArray(res.data) ? res.data : [res.data],
        };
      }
      return {
        success: false,
        error: `HTTP Error: ${res.status}`,
        code: res.status.toString(),
      };
    } catch (error: any) {
      console.error("Error fetching pending exercises:", error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  // Approve service - reject exercise
  async rejectExercise(exerciseId: string, reason?: string): Promise<MutationResult<any>> {
    try {
      const res = await axiosInstance.post(`exercises/${exerciseId}/reject`, { reason });
      if (res.status === 200 || res.status === 201) {
        return {
          success: true,
          data: res.data,
        };
      }
      return {
        success: false,
        error: `HTTP Error: ${res.status}`,
        code: res.status.toString(),
      };
    } catch (error: any) {
      console.error("Error rejecting exercise:", error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }
}

export default ExerciseService;
