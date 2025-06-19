<<<<<<< Updated upstream

import { Button } from "@/components/ui/button";
import { ShoppingCart, DownloadCloud, SendHorizontal, ShieldCheck, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-sm rounded-lg border-4 border-[#40414F] p-4">
        <h3 className="text-lg font-bold mb-3">次のステップ</h3>
        <div className="grid gap-3">
          <Button 
            className="flex justify-start items-center gap-3 bg-[#40414F] hover:bg-[#2D2E3A] text-left"
            onClick={() => navigate('/supplies')}
          >
            <ShoppingCart />
            <div>
              <div className="font-medium">備蓄品リストを作成</div>
              <div className="text-sm font-normal opacity-80">組織に適した防災備蓄品リストを作成します</div>
            </div>
          </Button>
          <Button 
            className="flex justify-start items-center gap-3 bg-[#40414F] hover:bg-[#2D2E3A] text-left"
            onClick={() => {}}
          >
            <DownloadCloud />
            <div>
              <div className="font-medium">診断結果をダウンロード</div>
              <div className="text-sm font-normal opacity-80">今回の診断結果をPDFでダウンロードします</div>
            </div>
          </Button>
          <Button 
            className="flex justify-start items-center gap-3 bg-[#40414F] hover:bg-[#2D2E3A] text-left"
            onClick={() => {}}
          >
            <SendHorizontal />
            <div>
              <div className="font-medium">診断結果を共有</div>
              <div className="text-sm font-normal opacity-80">診断結果をメールで関係者に共有します</div>
            </div>
          </Button>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-4 border">
        <h3 className="text-lg font-bold mb-3">その他のサービス</h3>
        <div className="grid gap-3">
          <Button 
            variant="outline"
            className="flex justify-start items-center gap-3 text-left"
            onClick={() => {}}
          >
            <ShieldCheck />
            <div>
              <div className="font-medium">BCP策定支援</div>
              <div className="text-sm text-gray-500">事業継続計画の作成をサポートします</div>
            </div>
          </Button>
          <Button 
            variant="outline"
            className="flex justify-start items-center gap-3 text-left"
            onClick={() => {}}
          >
            <Video />
            <div>
              <div className="font-medium">防災研修サービス</div>
              <div className="text-sm text-gray-500">オンライン防災研修を提供します</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
=======

import { Button } from "@/components/ui/button";
import { ShoppingCart, DownloadCloud, SendHorizontal, ShieldCheck, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupplies } from "@/contexts/SuppliesContext";
import { buildOrderUrl } from "@/utils/orderUrl";

export const ActionButtons = () => {
  const navigate = useNavigate();
  const { concreteCartItems } = useSupplies();

  const handleCreateSuppliesList = () => {
    // カート内のアイテムからorderDataを作成
    const orderData = concreteCartItems.map(item => ({
      [item.product_code]: item.quantity
    }));
    // URLを構築して新しいタブで開く
    const url = buildOrderUrl(orderData);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-sm rounded-lg border-4 border-[#40414F] p-4">
        <h3 className="text-lg font-bold mb-3">次のステップ</h3>
        <div className="grid gap-3">
          <Button
            className="flex justify-start items-center gap-3 bg-[#40414F] hover:bg-[#2D2E3A] text-left"
            onClick={handleCreateSuppliesList}
          >
            <ShoppingCart />
            <div>
              <div className="font-medium">備蓄品リストを作成</div>
              <div className="text-sm font-normal opacity-80">組織に適した防災備蓄品リストを作成します</div>
            </div>
          </Button>
          <Button
            className="flex justify-start items-center gap-3 bg-[#40414F] hover:bg-[#2D2E3A] text-left"
            onClick={() => {}}
          >
            <DownloadCloud />
            <div>
              <div className="font-medium">診断結果をダウンロード</div>
              <div className="text-sm font-normal opacity-80">今回の診断結果をPDFでダウンロードします</div>
            </div>
          </Button>
          <Button
            className="flex justify-start items-center gap-3 bg-[#40414F] hover:bg-[#2D2E3A] text-left"
            onClick={() => {}}
          >
            <SendHorizontal />
            <div>
              <div className="font-medium">診断結果を共有</div>
              <div className="text-sm font-normal opacity-80">診断結果をメールで関係者に共有します</div>
            </div>
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 border">
        <h3 className="text-lg font-bold mb-3">その他のサービス</h3>
        <div className="grid gap-3">
          <Button
            variant="outline"
            className="flex justify-start items-center gap-3 text-left"
            onClick={() => {}}
          >
            <ShieldCheck />
            <div>
              <div className="font-medium">BCP策定支援</div>
              <div className="text-sm text-gray-500">事業継続計画の作成をサポートします</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="flex justify-start items-center gap-3 text-left"
            onClick={() => {}}
          >
            <Video />
            <div>
              <div className="font-medium">防災研修サービス</div>
              <div className="text-sm text-gray-500">オンライン防災研修を提供します</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
>>>>>>> Stashed changes
