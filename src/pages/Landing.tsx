import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-end p-4 gap-4">
        <button className="text-gray-600 hover:text-gray-900">Q&A</button>
        <button className="text-gray-600 hover:text-gray-900">利用規約</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-[#2A303C]">
              法人向け 防災備蓄に必要なもの
            </h1>
            <h2 className="text-4xl font-bold text-[#2A303C]">
              診断AIチャット
            </h2>
          </div>
          <p className="text-gray-600">
            シンプルな質問に答えるだけで、必要な備蓄品をAIが導き出します！
          </p>
          <Button 
            onClick={() => navigate("/diagnosis")}
            className="bg-[#2A303C] hover:bg-[#40414F] text-white px-8 py-6 text-lg rounded-xl"
          >
            診断を始める →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;