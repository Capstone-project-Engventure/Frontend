import { axiosInstance } from "../Api";
import { Topic } from "../types/topic";
import { BaseService } from "./base.service";
import { GetAllResult, GetSingleResult } from "../types/api";

class TopicService extends BaseService<Topic>{
  constructor() {
    super("topics");
  }

  // Get topics by category (skill)
  async getByCategory(category: string, params?: { page?: number; pageSize?: number; search?: string }): Promise<GetAllResult<Topic>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (category) queryParams.append('category', category);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params?.search) queryParams.append('search', params.search);

      const res = await axiosInstance.get(`/${this.endpoint}?${queryParams.toString()}`);
      
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

  // Get topics count by category
  async getCategoryStats(): Promise<GetSingleResult<Record<string, number>>> {
    try {
      const res = await axiosInstance.get(`/${this.endpoint}/category-stats`);
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
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  // Get all categories with topics count
  async getCategories(): Promise<GetAllResult<string>> {
    try {
      const res = await axiosInstance.get(`/${this.endpoint}/categories`);
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
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }
}

export default TopicService;
