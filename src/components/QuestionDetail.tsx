import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuestionDetailProps {
  title: string;
  description: string;
  importance: string;
  recommendations: string[];
}

export const QuestionDetail = ({
  title,
  description,
  importance,
  recommendations
}: QuestionDetailProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[#2A303C]">{title}</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-6">
          <div className="p-4 bg-white/50 rounded-lg">
            <h4 className="font-bold mb-2 text-[#2A303C]">概要</h4>
            <p className="text-gray-600">{description}</p>
          </div>
          
          <div className="p-4 bg-white/50 rounded-lg">
            <h4 className="font-bold mb-2 text-[#2A303C]">重要性</h4>
            <p className="text-gray-600">{importance}</p>
          </div>

          <div className="p-4 bg-white/50 rounded-lg">
            <h4 className="font-bold mb-2 text-[#2A303C]">推奨事項</h4>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-600">{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};