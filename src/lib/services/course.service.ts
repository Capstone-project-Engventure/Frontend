import { useApi } from "../Api";
import { Course } from "../types/course";

const api = useApi();

interface ApiResponse<T> {
  success: boolean;
  data: T ;
}

class CourseService {
 
   async getAllCourses(
      page?: number,
      pageSize?: number
    ): Promise<ApiResponse<Course[]>> {
      const cacheKey = "lesson_cache";
      const saved = localStorage.getItem(cacheKey);
      try {
        const params: Record<string, any> = {};
        if (page) params.page = page;
        if (pageSize) params.page_size = pageSize;
  
        const res = await api.get("/courses", { params });
  
        if (res.status == 200) {
          return {
            success: true,
            data: res.data as Course[],
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
    async getCourseById(id: number): Promise<ApiResponse<Course>> {
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.status === 200) {
          return {
            success: true,
            data: res.data as Course,
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
  
    async createCourse(data: Partial<Course>): Promise<ApiResponse<Course>> {
      try {
        const res = await api.post("/courses", data);
        if (res.status === 201) {
          return {
            success: true,
            data: res.data as Course,
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
  
    async updateCourse(
      id: number,
      data: Partial<Course>
    ): Promise<ApiResponse<Course>> {
      try {
        const res = await api.put(`/courses/${id}`, data);
        if (res.status === 200) {
          return {
            success: true,
            data: res.data as Course,
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
  
    async deleteCourse(id: number): Promise<ApiResponse<null>> {
      try {
        const res = await api.delete(`/courses/${id}`);
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
export default CourseService;
