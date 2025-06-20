import { useApi } from "../Api";
import { DeleteResult, GetAllResult, GetSingleResult, MutationResult } from "@/lib/types/api";
// import { PaginatedResponse } from "../types/response";
const api = useApi();
const defaultConfig = {
    headers: {
      'Content-Type': 'application/json',
    },  
  };

export abstract class BaseService<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public async getAll({
    page,
    pageSize,
    keyword,
    filters,
  }: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    filters?: Record<string, any>;
  } = {}): Promise<GetAllResult<T>> {
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
          const paginatedData = res.data;
          return {
            success: true,
            data: paginatedData.results,
            pagination: {
              current_page: paginatedData.page,
              total_page: paginatedData.num_pages,
              total_count: paginatedData.total_count,
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
    } finally {
    }
  }

  public async getById(id: string | number): Promise<GetSingleResult<T>> {
    const res = await api.get(`${this.endpoint}/${id}`);
    if (res.status === 200) {
      return {
        success: true,
        data: res.data as T,
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

  public async create(data: Partial<T>, config: any = defaultConfig): Promise<MutationResult<T>> {
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

  public async update(
    id: string | number,
    data: Partial<T>,
    config: any= defaultConfig
  ): Promise<MutationResult<T>> {
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

  public async partialUpdate(
    id: string | number,
    data: Partial<T>,
    config: any = defaultConfig
  ): Promise<MutationResult<T>> {
    try {
      const res = await api.patch(`${this.endpoint}/${id}`, data, config);
      if (res.status === 200) {
        return {
          success: true,
          data: res.data as T,
        };
      }
      return {
        success: false,
        error: `HTTP Error: ${res.status}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        code: error.code,
      };
    }
  }

  public async delete(id: number): Promise<DeleteResult> {
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
        error: `Unexpected status code: ${res.status}`,
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

  public async deleteMultiple(
    items: Array<number>
  ): Promise<DeleteResult> {
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
        error: `Unexpected status code: ${res.status}`,
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
