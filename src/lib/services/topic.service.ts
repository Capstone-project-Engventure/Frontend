import { axiosInstance } from "../Api";
import { Topic } from "../types/topic";
import { BaseService } from "./base.service";

class TopicService extends BaseService<Topic>{
  constructor() {
    super("topics");
  }

  // Get topics by category (skill)
  async getByCategory(category: string, params?: { page?: number; pageSize?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    
    if (category) queryParams.append('category', category);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);

    return axiosInstance.get(`/${this.endpoint}?${queryParams.toString()}`);
  }

  // Get topics count by category
  async getCategoryStats() {
    return axiosInstance.get(`/${this.endpoint}/category-stats`);
  }

  // Get all categories with topics count
  async getCategories() {
    return axiosInstance.get(`/${this.endpoint}/categories`);
  }
}

export default TopicService;
