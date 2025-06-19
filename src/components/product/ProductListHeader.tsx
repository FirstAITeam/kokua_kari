
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ProductListHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-4xl font-black text-[#2A303C]" 
              style={{ fontFamily: "'M PLUS 1p', sans-serif" }}
            >
              <span className="text-5xl mr-2">AI</span>
              防災診断
            </h1>
          </div>
          <Button 
            variant="outline" 
            className="border-2 border-[#40414F]"
            onClick={() => navigate("/diagnosis-result")}
          >
            編集完了
          </Button>
        </div>
      </div>
    </header>
  );
};
