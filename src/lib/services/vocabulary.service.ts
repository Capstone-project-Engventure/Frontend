import { useApi } from "../Api";
import { Vocabulary } from "@/lib/types/vocabulary";
import { BaseService } from "./base.service";
import { GetAllResult, MutationResult } from "../types/api";
const api = useApi();

class VocabularyService extends BaseService<Vocabulary> {
  constructor() {
    super("vocabularies");
  }
  async getAllVocabulary(page: number, pageSize: number, keyword?: string, topic_id?:string, pos?:string): Promise<GetAllResult<Vocabulary>> {
    try {
      const params: Record<string, any> = {
        page,
        page_size: pageSize
      };
      if (keyword) params.keyword = keyword;
      if (topic_id && topic_id !== "") params.topic_id = topic_id;
      if (pos && pos !== "") params.pos = pos;
      

      const res = await api.get('/vocabularies', { params });
      
      if (res.status === 200) {
        return {
          success: true,
          data: res.data.results as Vocabulary[],
          pagination: {
            current_page: res.data.page,
            total_page: res.data.num_pages,
            total_count: res.data.total_count || res.data.count,
          },
        };
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
 
  async getVocabByTopic(topicId:string): Promise<GetAllResult<Vocabulary>>{
    try {
      const res = await api.get(`/vocabularies?topic_id=${topicId}`);
      if (res.status === 200) {
        return {
          success: true,
          data: Array.isArray(res.data) ? res.data : res.data.results || [res.data],
        };
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

  async importVocabByFile(file: File): Promise<MutationResult<any>> {
    try {
      const formData = new FormData();
 
      formData.append("file", file);
      const res = await api.post("/vocabularies/import-file", formData, {
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

}
export default VocabularyService;
