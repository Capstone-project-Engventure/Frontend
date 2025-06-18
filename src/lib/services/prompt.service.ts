import { useApi } from "../Api";
import { Topic as Prompt } from "../types/topic";
import { BaseService } from "./base.service";

class PromptService extends BaseService<Prompt> {
  constructor() {
    super("prompts");
  }

  async getByName(name: string) {
    const api = useApi();
    const res = await api.get(`/prompts`, {
      params: { name },
    });
    return res.data[0]?.content; // return plain text content
  }
  async getByNameAndEngine(name: string, engine: string) {
    const api = useApi();
    const res = await api.get(`/prompts`, {
      params: { name, engine },
    });
    return res.data[0]?.content; // return plain text content
  }

  async getRecentPrompts(engine: string, limit = 4) {
    const api = useApi();
    const res = await api.get(`/prompts/recent`, {
      params: { engine, limit },
    });
    return res.data; // array of { name, content, engine }
  }
}
export default PromptService;
