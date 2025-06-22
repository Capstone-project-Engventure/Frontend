// LLM Mode Validation Utility
import { toast } from 'react-toastify';

export interface LLMHealthStatus {
  overall: boolean;
  llm: boolean;
  chain: boolean;
  database: boolean;
  llm_api: boolean;
  mode: string;
}

export class LLMModeValidator {
  static validateModeAvailability(
    selectedMode: 'vertex' | 'ollama',
    healthStatus: LLMHealthStatus | null
  ): {
    isValid: boolean;
    actualMode: string;
    warning?: string;
  } {
    if (!healthStatus) {
      return {
        isValid: false,
        actualMode: 'unknown',
        warning: 'Unable to determine LLM health status'
      };
    }

    const actualMode = healthStatus.mode;
    
    // Check if selected mode matches actual mode
    if (selectedMode !== actualMode) {
      const warning = this.getModeWarningMessage(selectedMode, actualMode);
      
      return {
        isValid: false,
        actualMode,
        warning
      };
    }

    return {
      isValid: true,
      actualMode
    };
  }

  static getModeWarningMessage(selected: string, actual: string): string {
    const messages = {
      'vertex-to-ollama': `
        ⚠️ Bạn chọn Vertex AI nhưng hệ thống đang sử dụng Ollama!
      //   Nguyên nhân:
      //   • Vertex AI chưa được cấu hình (USE_VERTEX=false)
      //   • Thiếu Google credentials
      //   • Vertex AI service không khả dụng
        
      //   Giải pháp:
      //   1. Cấu hình .env trong run_LLM/: USE_VERTEX=true
      //   2. Thêm GOOGLE_APPLICATION_CREDENTIALS
      //   3. Hoặc chuyển mode thành "Ollama" ở frontend
      // `,
      // 'ollama-to-vertex': `
      //   ℹ️ Bạn chọn Ollama nhưng hệ thống đang sử dụng Vertex AI.
      //   Điều này có thể xảy ra khi Ollama không khả dụng và hệ thống fallback sang Vertex.
      // `,
      // 'vertex-to-deepseek': `
      //   ℹ️ Bạn chọn Vertex AI nhưng hệ thống đang sử dụng DeepSeek.
      //   Điều này có thể xảy ra khi Vertex không khả dụng và hệ thống fallback sang DeepSeek.
      // `,
      // 'ollama-to-deepseek': `
      //   ℹ️ Bạn chọn Ollama nhưng hệ thống đang sử dụng DeepSeek.
      //   Điều này có thể xảy ra khi Ollama không khả dụng và hệ thống fallback sang DeepSeek.
      // `
    };

    const key = `${selected}-to-${actual}` as keyof typeof messages;
    return messages[key] || `Mode mismatch: Selected ${selected}, using ${actual}`;
  }

  static showModeWarning(selectedMode: 'vertex' | 'ollama', healthStatus: LLMHealthStatus | null): void {
    const validation = this.validateModeAvailability(selectedMode, healthStatus);
    
    if (!validation.isValid && validation.warning) {
      // Show detailed warning for vertex-to-ollama mismatch
      if (selectedMode === 'vertex' && validation.actualMode === 'ollama') {
        toast.warning(validation.warning, {
          autoClose: 8000,
          position: 'top-right'
        });
      } else {
        toast.info(validation.warning, {
          autoClose: 5000
        });
      }
    }
  }

  static getConfigurationGuide(): string {
    return `
# LLM Configuration Guide

## To Enable Vertex AI:
1. Create/edit run_LLM/.env:
   USE_VERTEX=true
   VERTEX_PROJECT=your-gcp-project-id
   VERTEX_LOCATION=asia-southeast1
   VERTEX_LLM_MODEL=gemini-pro
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

2. Restart LLM service:
   cd run_LLM
   python -m app.main

## To Use Ollama (Default):
1. Make sure Ollama is running:
   ollama serve
   
2. Pull required model:
   ollama pull llama3.2:1b

## To Enable DeepSeek:
1. Add to run_LLM/.env:
   USE_DEEPSEEK=true
   DEEPSEEK_API_KEY=your-api-key
    `;
  }
}

// React Hook for mode validation
export const useLLMModeValidator = () => {
  const validateAndWarn = (
    selectedMode: 'vertex' | 'ollama',
    healthStatus: LLMHealthStatus | null
  ) => {
    return LLMModeValidator.validateModeAvailability(selectedMode, healthStatus);
  };

  const showWarning = (
    selectedMode: 'vertex' | 'ollama',
    healthStatus: LLMHealthStatus | null
  ) => {
    LLMModeValidator.showModeWarning(selectedMode, healthStatus);
  };

  return {
    validateAndWarn,
    showWarning,
    getConfigGuide: LLMModeValidator.getConfigurationGuide
  };
}; 