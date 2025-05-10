import { useApi } from "../Api";
import { Vocabulary } from "@/lib/types/vocabulary";
const api = useApi();

interface ApiResponse<T> {
  success: boolean;
  data: T | string;
  current_page?: number;
  total_page?: number;
}

class VocabularyService {
  async getAllVocabulary(page: number, pageSize: number, keyword?: string) {
    try {
      const params: Record<string, any> = {
        page,
        page_size: pageSize
      };
      if (keyword) params.keyword = keyword;

      const res = await api.get('/vocabularies', { params });
      return {
        success: true,
        data: res.data.results as Vocabulary[],
        current_page: res.data.page,
        total_page: res.data.num_pages,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }
  getById(id: number) {
    return api.get(`/vocabularies/${id}`);
  }
  create(data: Vocabulary) {
    return api.post("/vocabularies", data);
  }
  update(id: number, data: Vocabulary) {
    return api.put(`/vocabularies/${id}`, data);
  }
  delete(id: number) {
    return api.delete(`/vocabularies/${id}`);
  }
}
export default VocabularyService;
