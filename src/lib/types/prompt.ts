export interface PromptVariable {
  name: string;
  type: 'string' | 'integer' | 'boolean' | 'array' | 'object';
  required: boolean;
  default?: any;
  help_text?: string;
}

export interface FewShotExample {
  id: number;
  input: Record<string, any>;
  output: Record<string, any>;
  description?: string;
}

export interface Prompt {
  id: number;
  name: string;
  content: string;
  output_schema: Record<string, any>;
  variables: PromptVariable[];
  use_few_shot: boolean;
  few_shot_examples: FewShotExample[];
  min_count: number;
  max_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Simplified version for table display
export interface PromptTableItem {
  id: number;
  name: string;
  content: string;
  use_few_shot: boolean;
  min_count: number;
  max_count: number;
  is_active: boolean;
  created_at: string;
  variables_count: number; // computed field
  examples_count: number; // computed field
}

// For form/modal
export interface PromptFormData {
  name: string;
  content: string;
  output_schema: Record<string, any>;
  variables: PromptVariable[];
  use_few_shot: boolean;
  few_shot_examples: number[]; // array of IDs
  min_count: number;
  max_count: number;
  is_active: boolean;
}