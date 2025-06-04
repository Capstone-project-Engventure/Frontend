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

  public async getAll({
    page,
    pageSize,
    keyword,
    filters
  }: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    filters?: Record<string, any>;
  }={}): Promise<ApiResponse<T>> {
    try {
      const params: Record<string, any> = {};
      if (page) params.page = page;
      if (pageSize) params.page_size = pageSize;
      if (keyword) params.keyword = keyword;
      if (filters) {
        Object.assign(params, filters);
      }

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
    }finally{
      
       
    }
  }

  public async getById(id: string): Promise<ApiResponse<T>> {
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

  public async create(data: Partial<T>, config: any): Promise<ApiResponse<T>> {
    try {
      const res = await api.post(`${this.endpoint}`, data, config);
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

  public async update(
    id: string | number,
    data: Partial<T>,
    config: any
  ): Promise<ApiResponse<T>> {
    try {
      const res = await api.put(`${this.endpoint}/${id}`, data, config);
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

  public async deleteMultiple(
    items: Array<number>
  ): Promise<ApiResponse<null>> {
    try {
      const res = await api.delete(`${this.endpoint}`, {
        data: { ids: items },
      });
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
