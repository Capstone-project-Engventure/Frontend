import { useApi } from "../Api";
import { Prompt } from "../types/prompt";
import { BaseService } from "./base.service";

class PromptService extends BaseService<Prompt> {
  constructor() {
    super("prompts");
  }

  // Get all prompts from database
  async getAllPrompts() {
    const api = useApi();
    try {
      const res = await api.get(`/${this.endpoint}`);
      return {
        success: true,
        data: res.data || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch prompts',
        data: []
      };
    }
  }

  // Get prompt by name from database
  async getByName(name: string) {
    const api = useApi();
    try {
      const res = await api.get(`/${this.endpoint}`, {
        params: { name },
      });
      return {
        success: true,
        data: res.data?.[0] || null
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch prompt',
        data: null
      };
    }
  }

  // Get prompt by name and engine (for specific AI models)
  async getByNameAndEngine(name: string, engine: string) {
    const api = useApi();
    try {
      const res = await api.get(`/${this.endpoint}`, {
        params: { name, engine },
      });
      return {
        success: true,
        data: res.data?.[0] || null
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch prompt',
        data: null
      };
    }
  }

  // Get recent prompts (last 4 used)
  async getRecentPrompts(limit = 4) {
    const api = useApi();
    try {
      const res = await api.get(`/${this.endpoint}/recent`, {
        params: { limit },
      });
      return {
        success: true,
        data: res.data || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch recent prompts',
        data: []
      };
    }
  }

  // Get prompts filtered by skill and exercise type
  async getPromptsBySkillAndType(skill?: string, type?: string) {
    const api = useApi();
    try {
      const params: any = {};
      if (skill) params.skill = skill;
      if (type) params.type = type;
      
      const res = await api.get(`/${this.endpoint}`, { params });
      return {
        success: true,
        data: res.data || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch prompts',
        data: []
      };
    }
  }

  // Health check for LLM services
  async checkLLMHealth(mode: 'vertex' | 'ollama' = 'ollama') {
    const api = useApi();
    try {
      console.log(`🔍 Starting health check for mode: ${mode}`);
      console.log('Requesting health endpoint: /health/');
      
      const res = await api.get('/health/');
      
      // Log raw response từ backend
      console.log('=== RAW HEALTH API RESPONSE ===');
      console.log('Status:', res.status);
      console.log('Headers:', res.headers);
      console.log('Raw data:', JSON.stringify(res.data, null, 2));
      console.log('===============================');
      
      const components = res.data.components || {};
      
      // Log quá trình xử lý components
      console.log('=== PROCESSING COMPONENTS ===');
      console.log('Components from response:', JSON.stringify(components, null, 2));
      
      // Check component status
      const databaseStatus = components.database?.ok || false;
      const llmApiStatus = components.llm_api?.ok || false;
      
      console.log('Database status extracted:', databaseStatus);
      console.log('LLM API status extracted:', llmApiStatus);
      
      // If LLM API is available, check detailed pipelines
      let llmStatus = false;
      let chainStatus = false;
      
      if (llmApiStatus && components.llm_api?.components) {
        const llmComponents = components.llm_api.components;
        const llmKey = `${mode}_llm`;
        const chainKey = `${mode}_chain`;
        
        console.log('LLM API components:', JSON.stringify(llmComponents, null, 2));
        console.log(`Looking for keys: ${llmKey}, ${chainKey}`);
        
        llmStatus = llmComponents[llmKey]?.ok || false;
        chainStatus = llmComponents[chainKey]?.ok || false;
        
        console.log(`${llmKey} status:`, llmStatus);
        console.log(`${chainKey} status:`, chainStatus);
      } else {
        console.log('No LLM API components found or LLM API not available');
      }
      
      const processedData = {
        overall: res.data.status === 'healthy',
        llm: llmStatus,
        chain: chainStatus,
        database: databaseStatus,
        llm_api: llmApiStatus,
        mode: mode,
        components: components
      };
      
      console.log('=== PROCESSED HEALTH DATA ===');
      console.log('Processed data:', JSON.stringify(processedData, null, 2));
      console.log('=============================');
      
      return {
        success: true,
        data: processedData
      };
    } catch (error: any) {
      console.error('=== HEALTH CHECK API ERROR ===');
      console.error('Error occurred:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('==============================');
      
      return {
        success: false,
        error: error.message || 'Failed to check LLM health',
        data: {
          overall: false,
          llm: false,
          chain: false,
          database: false,
          llm_api: false,
          mode: mode,
          components: {}
        }
      };
    }
  }
}

export default PromptService;
