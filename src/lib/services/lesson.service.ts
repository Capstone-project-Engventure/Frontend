import { axiosInstance } from "../Api";
import { Lesson } from "../types/lesson";
import { BaseService } from "./base.service";
import { MutationResult, GetAllResult } from "../types/api";


class LessonService extends BaseService<Lesson> {
  constructor() {
    super("lessons");
  }

  async getAllByTopic(
    topicId: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<GetAllResult<Lesson>> {
    try {
      const res = await axiosInstance.get("/lessons", {
        params: { topic: topicId, ...params },
      });

      if (res.status === 200) {
        if (params?.pageSize) {
          const paginatedData = res.data;
          return {
            success: true,
            data: paginatedData.results || res.data,
            pagination: {
              current_page: paginatedData.page || 1,
              total_page: paginatedData.num_pages || 1,
              total_count: paginatedData.total_count || (Array.isArray(res.data) ? res.data.length : 1),
            },
          };
        } else {
          return {
            success: true,
            data: Array.isArray(res.data) ? res.data : [res.data],
          };
        }
      } else {
        return {
          success: false,
          error: `HTTP Error: ${res.status}`,
          code: res.status.toString(),
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  async importByFile(file: File): Promise<MutationResult<any>> {
    try {
      const formData = new FormData();
      console.log("it came here");

      formData.append("file", file);
      const res = await axiosInstance.post("/lessons/import-file", formData, {
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

  async getAllSpeakingLessons(
    params?: { page?: number; pageSize?: number }
  ): Promise<GetAllResult<Lesson>> {
    try {
      const res = await axiosInstance.get("/lessons", {
        params: { type: "practice_speaking", ...params },
      });

      if (res.status === 200) {
        if (params?.pageSize) {
          const paginatedData = res.data;
          return {
            success: true,
            data: paginatedData.results || res.data,
            pagination: {
              current_page: paginatedData.page || 1,
              total_page: paginatedData.num_pages || 1,
              total_count: paginatedData.total_count || (Array.isArray(res.data) ? res.data.length : 1),
            },
          };
        } else {
          return {
            success: true,
            data: Array.isArray(res.data) ? res.data : [res.data],
          };
        }
      } else {
        return {
          success: false,
          error: `HTTP Error: ${res.status}`,
          code: res.status.toString(),
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  async getAllListeningLessons(
    params?: { page?: number; pageSize?: number }
  ): Promise<GetAllResult<Lesson>> {
    try {
      const res = await axiosInstance.get("/lessons", {
        params: { type: "listening_practice", ...params },
      });

      if (res.status === 200) {
        if (params?.pageSize) {
          const paginatedData = res.data;
          return {
            success: true,
            data: paginatedData.results || res.data,
            pagination: {
              current_page: paginatedData.page || 1,
              total_page: paginatedData.num_pages || 1,
              total_count: paginatedData.total_count || (Array.isArray(res.data) ? res.data.length : 1),
            },
          };
        } else {
          return {
            success: true,
            data: Array.isArray(res.data) ? res.data : [res.data],
          };
        }
      } else {
        return {
          success: false,
          error: `HTTP Error: ${res.status}`,
          code: res.status.toString(),
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  async getAllGrammarLessons(
    params?: { page?: number; pageSize?: number }
  ): Promise<GetAllResult<Lesson>> {
    try {
      const res = await axiosInstance.get("/lessons", {
        params: { type: "grammar_practice", ...params },
      });

      if (res.status === 200) {
        if (params?.pageSize) {
          const paginatedData = res.data;
          return {
            success: true,
            data: paginatedData.results || res.data,
            pagination: {
              current_page: paginatedData.page || 1,
              total_page: paginatedData.num_pages || 1,
              total_count: paginatedData.total_count || (Array.isArray(res.data) ? res.data.length : 1),
            },
          };
        } else {
          return {
            success: true,
            data: Array.isArray(res.data) ? res.data : [res.data],
          };
        }
      } else {
        return {
          success: false,
          error: `HTTP Error: ${res.status}`,
          code: res.status.toString(),
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }
}

export default LessonService;
