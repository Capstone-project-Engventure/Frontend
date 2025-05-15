import { useApi } from "../Api";
import { Vocabulary } from "@/lib/types/vocabulary";
import { BaseService } from "./base.service";
const api = useApi();

class VocabularyService extends BaseService<Vocabulary> {
  constructor() {
    super("vocabularies");
  }
  async getAllVocabulary(page: number, pageSize: number, keyword?: string, topic_id?:string, pos?:string) {
    try {
      const params: Record<string, any> = {
        page,
        page_size: pageSize
      };
      if (keyword) params.keyword = keyword;
      if (topic_id) params.topic_id = topic_id;
      if (pos) params.pos = pos;
      

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
 
  getVocabByTopic(topicId:string){
    return api.get(`/vocabularies?topic_id=${topicId}`)
  }


}
export default VocabularyService;
