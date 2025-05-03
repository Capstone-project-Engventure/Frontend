import { useApi } from "../Api";
import { Lesson } from "../types/lesson";

const api = useApi();

interface ApiResponse<T> {
  success: boolean;
  data: T ;
}

class LessonService {
  async getAllLessons(
    page?: number,
    pageSize?: number
  ): Promise<ApiResponse<Lesson[]>> {
    const cacheKey = "lesson_cache";
    const saved = localStorage.getItem(cacheKey);
    try {
      const params: Record<string, any> = {};
      if (page) params.page = page;
      if (pageSize) params.page_size = pageSize;

      const res = await api.get("/lessons", { params });

      if (res.status == 200) {
        return {
          success: true,
          data: res.data as Lesson[],
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
  async getLessonById(id: number): Promise<ApiResponse<Lesson>> {
    try {
      const res = await api.get(`/lessons/${id}`);
      if (res.status === 200) {
        return {
          success: true,
          data: res.data as Lesson,
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

  async createLesson(data: Partial<Lesson>): Promise<ApiResponse<Lesson>> {
    try {
      const res = await api.post("/lessons", data);
      if (res.status === 201) {
        return {
          success: true,
          data: res.data as Lesson,
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

  async updateLesson(
    id: number,
    data: Partial<Lesson>
  ): Promise<ApiResponse<Lesson>> {
    try {
      const res = await api.put(`/lessons/${id}`, data);
      if (res.status === 200) {
        return {
          success: true,
          data: res.data as Lesson,
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

  async deleteLesson(id: number): Promise<ApiResponse<null>> {
    try {
      const res = await api.delete(`/lessons/${id}`);
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
export default LessonService;
