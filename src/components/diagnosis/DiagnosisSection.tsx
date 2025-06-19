
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StepProgress } from "../steps/StepProgress";
import { DiagnosisResultTable } from "../chat/DiagnosisResultTable";
import { StepData, DiagnosisResultItem } from '@/types/chat';
import { Button } from "../ui/button";
import { Eye, ClipboardList, DollarSign, ArrowRight } from "lucide-react";
import { SuppliesListDialog } from "../dialog/SuppliesListDialog";
import { DiagnosisResultDialog } from "../dialog/DiagnosisResultDialog";
import { useFilteredRecommendedItems } from "@/hooks/useRecommendedStockItems";
import { useSupplies } from '@/contexts/SuppliesContext';
import { calculateTotalPrice } from "@/utils/priceMapping";
import { supabase } from "@/integrations/supabase/client";

interface DiagnosisSectionProps {
  showDiagnosisResult: boolean;
  steps: StepData[];
  currentStep: string;
  completedSteps: string[];
  diagnosisResultItems: DiagnosisResultItem[];
  onReopenDiagnosisDialog?: () => void;
}

export const DiagnosisSection: React.FC<DiagnosisSectionProps> = ({
  showDiagnosisResult,
  steps,
  currentStep,
  completedSteps,
  diagnosisResultItems,
  onReopenDiagnosisDialog
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [suppliesDialogOpen, setSuppliesDialogOpen] = useState(false);
  const [diagnosisResultDialogOpen, setDiagnosisResultDialogOpen] = useState(false);

  // location.stateを確認して、step4に移動するフラグがあれば処理
  useEffect(() => {
    if (location.state?.goToStep4) {
      // stateをリセット（これをしないと再訪問時にもフラグが残る）
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const { 
    peopleCount, 
    selectedCorporateType, 
    cartItems, 
    addToConcreteCart,
    concreteCartItems 
  } = useSupplies();
  
  // 数値として扱うために変換
  const numericPeopleCount = typeof peopleCount === 'number' ? peopleCount : 0;
  
  const { filteredItems } = useFilteredRecommendedItems(
    selectedCorporateType,
    numericPeopleCount
  );
  
  const totalPrice = React.useMemo(() => {
    return calculateTotalPrice(cartItems);
  }, [cartItems]);

  useEffect(() => {
    if (showDiagnosisResult) {
      setSuppliesDialogOpen(true);
    }
  }, [showDiagnosisResult]);

  const handleDiagnosisContinue = () => {
    setDiagnosisResultDialogOpen(false);
  };

  // 代表製品IDから具体的な商品情報を取得する関数
  const fetchConcreteProduct = async (representativeProductId: number, stockItemId: number, quantity: number) => {
    try {
      const { data, error } = await supabase
        .from('concrete_products')
        .select('*')
        .eq('id', representativeProductId)
        .single();

      if (error) {
        console.error("Error fetching concrete product:", error);
        return null;
      }

      if (data) {
        return {
          id: data.id,
          product_name: data.product_name,
          unit_price: data.unit_price,
          image_url: data.image_url,
          product_code: data.product_code || `CP${data.id}`,
          recommended_stock_item_id: stockItemId,
          quantity: quantity
        };
      }
    } catch (err) {
      console.error("Exception when fetching concrete product:", err);
    }
    return null;
  };

  // 遷移前に全てのcartItemsの代表製品を取得してconcreteCartItemsに追加
  const handleNextStepClick = async () => {
    // すでに具体的な商品が選択されているアイテムはスキップするためのIDリスト
    const existingConcreteItemIds = concreteCartItems.map(item => item.recommended_stock_item_id);
    
    // 代表製品IDを持つがまだ具体的な商品が選択されていないアイテムを処理
    const itemsToProcess = cartItems.filter(item => 
      item.representative_product_id && 
      !existingConcreteItemIds.includes(item.recommended_stock_item_id)
    );

    // 各アイテムの代表製品を取得して追加
    for (const item of itemsToProcess) {
      if (item.representative_product_id) {
        const quantity = Math.ceil(item.calculatedQty || 0);
        const product = await fetchConcreteProduct(
          item.representative_product_id, 
          item.recommended_stock_item_id, 
          quantity
        );
        
        if (product) {
          addToConcreteCart(product);
        }
      }
    }

    // 処理完了後、結果ページに遷移
    navigate('/diagnosis-result');
  };

  // 「AIと対話をして絞り込もう」のSTEP4画面を表示
  const renderAiDialogStep = () => {
    return (
      <div className="bg-white rounded-lg border-4 border-[#40414F] p-8 mt-8 min-h-[650px] shadow-lg">
        <div className="text-center px-4 mb-8">
          <p className="text-lg font-bold mb-6">質問例：</p>
          <ul className="text-left max-w-2xl mx-auto space-y-6">
            <li className="text-lg">質問例：50人分のリストを30人分に削減したい。</li>
            <li className="text-lg">質問例：地震対策を優先して、それ以外の災害用備蓄を削って</li>
            <li className="text-lg">質問例：アルファ米じゃない備蓄食にして</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-40 transition-all hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
            onClick={() => setDiagnosisResultDialogOpen(true)}
          >
            <Eye className="h-10 w-10 mb-4 text-gray-700" />
            <p className="text-center font-medium">想定される被害と<br/>対策をチェック</p>
          </div>
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-40 transition-all hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
            onClick={() => setSuppliesDialogOpen(true)}
          >
            <ClipboardList className="h-10 w-10 mb-4 text-gray-700" />
            <p className="text-center font-medium">備蓄品リストを確認</p>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-40 transition-all hover:border-blue-500 hover:bg-blue-50 cursor-pointer">
            <div className="text-center">
              <p className="text-sm mb-2">想定される見積もり</p>
              <p className="text-blue-600 font-bold text-3xl mb-2">{totalPrice.toLocaleString()}円</p>
              <p className="text-sm">程度</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-12">
          <Button 
            className="bg-[#40414F] hover:bg-[#40414F]/80 text-white font-bold py-4 px-12 rounded-md text-xl transition-colors flex items-center gap-2"
            onClick={handleNextStepClick}
          >
            次のステップに進む
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full lg:w-3/5 space-y-6">
      {!showDiagnosisResult ? (
        <div className="relative">
          <StepProgress
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            heading={
              currentStep === 'step1' ? 'STEP 1' : 
              currentStep === 'step2' ? 'STEP 2' : 
              currentStep === 'step3' ? 'STEP 3' :
              currentStep === 'step4' ? 'STEP 4' :
              'STEP 4'
            }
            description={
              currentStep === 'step1' ? '住所を入力してください' : 
              currentStep === 'step2' ? '法人形態をお選びください' : 
              currentStep === 'step3' ? '人数規模を入れてください' :
              currentStep === 'step4' ? 'AIと対話をして絞り込もう' :
              '人数規模を入力してください'
            }
            subDescription={
              currentStep === 'step1' ? '災害リスクは、場所に応じて大きく異なります。\n活動地域の災害リスクを知りましょう' :
              currentStep === 'step2' ? '想定される被害や必要な対策は法人形態に大きく左右されます\n4つから選ぶと、次にリスク診断が実行されます' :
              currentStep === 'step3' ? '想定被害と対策がわかったと思います。\nこれらの対策を十分に行うために、\n必要な備蓄品数と見積もりを知りましょう' :
              currentStep === 'step4' ? '' : 
              ''
            }
          />
          
          {currentStep === 'step4' && renderAiDialogStep()}
        </div>
      ) : (
        <div className="relative">
          <StepProgress
            steps={steps}
            currentStep="step6"
            completedSteps={['step1', 'step2', 'step3', 'step4', 'step5']}
            heading="STEP 4"
            description="AIと対話をして絞り込もう"
            subDescription=""
          />
          
          {renderAiDialogStep()}
        </div>
      )}
      
      <SuppliesListDialog 
        open={suppliesDialogOpen}
        onOpenChange={setSuppliesDialogOpen}
      />
      
      <DiagnosisResultDialog
        open={diagnosisResultDialogOpen}
        onOpenChange={setDiagnosisResultDialogOpen}
        onContinue={handleDiagnosisContinue}
      />
    </div>
  );
};
