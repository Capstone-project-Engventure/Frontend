import { useApi } from "../Api";
import { Topic } from "../types/topic";

const api = useApi();

interface ApiResponse<T> {
  success: boolean;
  data: T | string;
  current_page?:number;
  total_page?:number
}

class TopicService {
  async getAllTopics(
    page?: number,
    pageSize?: number
  ): Promise<ApiResponse<Topic[]>> {
    const cacheKey = "Topic_cache";
    const saved = localStorage.getItem(cacheKey);
    try {
      const params: Record<string, any> = {};
      if (page) params.page = page;
      if (pageSize) params.page_size = pageSize;

      const res = await api.get("/topics", { params });

      if (res.status == 200) {
        return {
          success: true,
          data: res.data.results as Topic[],
          current_page: res.data.page,
          total_page: res.data.num_pages,
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
  async getTopicById(id:number): Promise<ApiResponse<Topic>>{
    try {
      const res = await api.get(`/topics/${id}`);
      if (res.status === 200) {
        return {
          success: true,
          data: res.data as Topic,
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

  async createTopic(data: Partial<Topic>): Promise<ApiResponse<Topic>> {
    try {
      const res = await api.post("/topics", data);
      if (res.status === 201) {
        return {
          success: true,
          data: res.data as Topic,
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

  async updateTopic(id: number, data: Partial<Topic>): Promise<ApiResponse<Topic>> {
    try {
      const res = await api.put(`/topics/${id}`, data);
      if (res.status === 200) {
        return {
          success: true,
          data: res.data as Topic,
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

  async deleteTopic(id: number): Promise<ApiResponse<null>> {
    try {
      const res = await api.delete(`/topics/${id}`);
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
export default TopicService;
