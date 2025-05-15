import { useApi } from "../Api";

const api = useApi();

interface ApiResponse<T> {
  success: boolean;
  data: Array<T> | T | string;
  current_page?: number;
  total_page?: number;
}

export abstract class BaseService<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public async getAll(
    page?: number,
    pageSize?: number,
    keyword?: string
  ): Promise<ApiResponse<T>> {
    try {
      const params: Record<string, any> = {};
      if (page) params.page = page;
      if (pageSize) params.page_size = pageSize;
      if (keyword) params.keyword = keyword;

      const res = await api.get(`${this.endpoint}`, { params });

      if (res.status == 200) {
        if (pageSize) {
          return {
            success: true,
            data: res.data.results as T[],
            current_page: res.data.page,
            total_page: res.data.num_pages,
          };
        } else {
          return {
            success: true,
            data: res.data,
          };
        }
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

  public async getById(id: number): Promise<ApiResponse<T>> {
    const res = await api.get(`${this.endpoint}/${id}`);
    if (res.status === 200) {
      return {
        success: true,
        data: res.data as T,
      };
    }
    return {
      success: false,
      data: "Unexpected status code: " + res.status,
    };
  }
  catch(error: any) {
    return {
      success: false,
      data: error.message,
    };
  }

  public async create(data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const res = await api.post(`${this.endpoint}`, data);
      if (res.status === 201) {
        return {
          success: true,
          data: res.data as T,
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

  public async update(id: number, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const res = await api.put(`${this.endpoint}/${id}`, data);
      if (res.status === 200) {
        return {
          success: true,
          data: res.data as T,
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

  public async delete(id: number): Promise<ApiResponse<null>> {
    try {
      const res = await api.delete(`${this.endpoint}/${id}`);
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
