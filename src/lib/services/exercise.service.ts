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
      const res = await axiosInstance.post("exercises/approve-single", { 
        exercise_data: exerciseData 
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

  // Bulk create multiple exercises
  async bulkCreate(exercises: Partial<Exercise>[]): Promise<MutationResult<any>> {
    try {
      const res = await axiosInstance.post("exercises/bulk-create", { exercises });
      if (res.status === 200 || res.status === 201 || res.status === 207) {
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
      console.error("Error bulk creating exercises:", error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  // Deploy service - publish approved exercises to make them available for students
  async publishExercises(exerciseIds: number[]): Promise<MutationResult<any>> {
    try {
      const res = await axiosInstance.post("exercises/publish", { 
        exercise_ids: exerciseIds 
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
      console.error("Error publishing exercises:", error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  // Deploy service - unpublish exercises (remove from student access)
  async unpublishExercises(exerciseIds: number[]): Promise<MutationResult<any>> {
    try {
      const res = await axiosInstance.post("exercises/unpublish", { 
        exercise_ids: exerciseIds 
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
      console.error("Error unpublishing exercises:", error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  // Deploy service - assign exercises to specific lessons
  async assignExercisesToLesson(exerciseIds: number[], lessonId: number): Promise<MutationResult<any>> {
    try {
      const res = await axiosInstance.post("exercises/assign-to-lesson", { 
        exercise_ids: exerciseIds,
        lesson_id: lessonId
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
      console.error("Error assigning exercises to lesson:", error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  // Deploy service - get published exercises available for students
  async getPublishedExercises(filters?: any): Promise<GetAllResult<Exercise>> {
    try {
      const params = {
        status: 'approved',
        is_published: true,
        ...filters
      };
      const res = await axiosInstance.get("exercises/published", { params });
      if (res.status === 200) {
        return {
          success: true,
          data: Array.isArray(res.data.results) ? res.data.results : [res.data],
          pagination: res.data.pagination
        };
      }
      return {
        success: false,
        error: `HTTP Error: ${res.status}`,
        code: res.status.toString(),
      };
    } catch (error: any) {
      console.error("Error fetching published exercises:", error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  // Deploy service - get deployment statistics
  async getDeploymentStats(): Promise<GetSingleResult<any>> {
    try {
      const res = await axiosInstance.get("exercises/deployment-stats");
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
      console.error("Error fetching deployment stats:", error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }
}

export default ExerciseService;
