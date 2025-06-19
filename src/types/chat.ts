
export interface Message {
  role: 'user' | 'ai';
  content: string;
  options?: string[];
  selectedOption?: string;
}

export interface QuestionDetail {
  title: string;
  description: string;
  importance: string;
  recommendations: string[];
}

export interface ScenarioStep {
  step_id: number;
  question_text: string;
  options: Array<{
    option_id: number;
    option_text: string;
    next_step_id?: number;
  }>;
}

export interface DiagnosisResult {
  output_text: string;
  recommended_products: string;
}

export interface DiagnosisResultItem {
  category: string;
  productName: string;
  quantity: string;
}

export interface ProgressStep {
  id: string;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

export interface StepData {
  id: string;
  label: string;
  sublabel?: string;
}
