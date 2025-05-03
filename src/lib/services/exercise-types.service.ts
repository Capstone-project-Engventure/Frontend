import { useApi } from "../Api";
import { ExerciseType } from "../types/exercise-type";

const api = useApi();

interface ApiResponse<T> {
  success: boolean;
  data: T ;
}

class ExerciseTypeService {
 
   async getAllExerciseTypes(
      page?: number,
      pageSize?: number
    ): Promise<ApiResponse<ExerciseType[]>> {

      try {
        const params: Record<string, any> = {};
        if (page) params.page = page;
        if (pageSize) params.page_size = pageSize;
  
        const res = await api.get("/exercises-types", { params });
  
        if (res.status == 200) {
          return {
            success: true,
            data: res.data as ExerciseType[],
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
    async getExerciseTypeById(id: number): Promise<ApiResponse<ExerciseType>> {
      try {
        const res = await api.get(`/exercises-types/${id}`);
        if (res.status === 200) {
          return {
            success: true,
            data: res.data as ExerciseType,
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
  
    async createExerciseType(data: Partial<ExerciseType>): Promise<ApiResponse<ExerciseType>> {
      try {
        const res = await api.post("/exercises-types", data);
        if (res.status === 201) {
          return {
            success: true,
            data: res.data as ExerciseType,
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
  
    async updateExerciseType(
      id: number,
      data: Partial<ExerciseType>
    ): Promise<ApiResponse<ExerciseType>> {
      try {
        const res = await api.put(`/exercises-types/${id}`, data);
        if (res.status === 200) {
          return {
            success: true,
            data: res.data as ExerciseType,
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
  
    async deleteExerciseType(id: number): Promise<ApiResponse<null>> {
      try {
        const res = await api.delete(`/exercises-types/${id}`);
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
export default ExerciseTypeService;
