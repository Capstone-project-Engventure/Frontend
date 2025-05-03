import { useApi } from "../Api";
import { Exercise } from "../types/exercise";

const api = useApi();

interface ApiResponse<T> {
  success: boolean;
  data: T ;
}

class ExerciseService {
 
   async getAllExercises(
      page?: number,
      pageSize?: number
    ): Promise<ApiResponse<Exercise[]>> {
      const cacheKey = "lesson_cache";
      const saved = localStorage.getItem(cacheKey);
      try {
        const params: Record<string, any> = {};
        if (page) params.page = page;
        if (pageSize) params.page_size = pageSize;
  
        const res = await api.get("/exercises", { params });
  
        if (res.status == 200) {
          return {
            success: true,
            data: res.data as Exercise[],
          };
        } else {
          return {
            success: false,
            data: "Unexpected status code: " + res.status,
          };
        }
      } catch (error: any) {
        return {
          success: false,
          data: error.message,
        };
      }
    }
    async getExerciseById(id: number): Promise<ApiResponse<Exercise>> {
      try {
        const res = await api.get(`/exercises/${id}`);
        if (res.status === 200) {
          return {
            success: true,
            data: res.data as Exercise,
          };
        }
        return {
          success: false,
          data: "Unexpected status code: " + res.status,
        };
      } catch (error: any) {
        return {
          success: false,
          data: error.message,
        };
      }
    }
  
    async createExercise(data: Partial<Exercise>): Promise<ApiResponse<Exercise>> {
      try {
        const res = await api.post("/exercises", data);
        if (res.status === 201) {
          return {
            success: true,
            data: res.data as Exercise,
          };
        }
        return {
          success: false,
          data: "Unexpected status code: " + res.status,
        };
      } catch (error: any) {
        return {
          success: false,
          data: error.message,
        };
      }
    }
  
    async updateExercise(
      id: number,
      data: Partial<Exercise>
    ): Promise<ApiResponse<Exercise>> {
      try {
        const res = await api.put(`/exercises/${id}`, data);
        if (res.status === 200) {
          return {
            success: true,
            data: res.data as Exercise,
          };
        }
        return {
          success: false,
          data: "Unexpected status code: " + res.status,
        };
      } catch (error: any) {
        return {
          success: false,
          data: error.message,
        };
      }
    }
  
    async deleteExercise(id: number): Promise<ApiResponse<null>> {
      try {
        const res = await api.delete(`/exercises/${id}`);
        if (res.status === 204) {
          return {
            success: true,
            data: null,
          };
        }
        return {
          success: false,
          data: "Unexpected status code: " + res.status,
        };
      } catch (error: any) {
        return {
          success: false,
          data: error.message,
        };
      }
    }
}
export default ExerciseService;
