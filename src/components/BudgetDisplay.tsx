
import { useState } from "react";
import { QuestionDetail } from "./QuestionDetail";
import { DiagnosisSection } from "./budget/DiagnosisSection";

interface QuestionDetailProps {
  title: string;
  description: string;
  importance: string;
  recommendations: string[];
}

interface BudgetDisplayProps {
  items: Array<{
    name: string;
    pricePerUnit: number;
    quantity: number;
  }>;
  totalBudget: number;
  effectiveness: number;
  categories: number;
  quality: string;
  people: number;
  days: number;
  organizationType: string;
  currentQuestionDetail: QuestionDetailProps;
  displayQuestionDetail: boolean;
  selectedDetail: 'budget' | 'effectiveness' | 'categories' | 'quality' | 'quantity' | 'question';
  onDetailChange: (detail: 'budget' | 'effectiveness' | 'categories' | 'quality' | 'quantity' | 'question') => void;
}

export const BudgetDisplay = ({
  items,
  totalBudget,
  effectiveness,
  categories,
  quality,
  people,
  days,
  organizationType,
  currentQuestionDetail,
  displayQuestionDetail,
  selectedDetail,
  onDetailChange
}: BudgetDisplayProps) => {
  return (
    <div className="space-y-4">
      <DiagnosisSection 
        totalBudget={totalBudget}
        effectiveness={effectiveness}
        categories={categories}
        quality={quality}
        people={people}
        days={days}
        items={items}
        currentQuestionDetail={currentQuestionDetail}
        onDetailChange={onDetailChange}
      />
    </div>
  );
};
