
import React from "react";

export const DiagnosisDamageSection: React.FC = () => {
  return (
    <div className="space-y-6 mb-8">
      <div className="bg-white rounded-md overflow-hidden border border-gray-200">
        <div className="p-5 bg-gray-50 border-b">
          <h3 className="font-bold text-xl">あなたの法人形態に重度な地震が起きた場合...</h3>
        </div>
        <div className="p-5">
          <div className="mb-4">
            <h4 className="font-semibold text-lg mb-2">被害想定</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>建物の損壊や倒壊の可能性</li>
              <li>従業員の負傷</li>
              <li>設備・機器の損傷</li>
              <li>電気・水道・ガスなどのライフラインの停止</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-lg mb-2">対策ポイント</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>建物・設備の耐震化</li>
              <li>家具・設備の固定</li>
              <li>非常用電源の確保</li>
              <li>通信手段の確保</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-2">BCP</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>データのバックアップ体制の整備</li>
              <li>代替拠点の確保</li>
              <li>サプライチェーンの代替策の検討</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-md overflow-hidden border border-gray-200">
        <div className="p-5 bg-gray-50 border-b">
          <h3 className="font-bold text-xl">あなたの法人形態に重度な水害が起きた場合...</h3>
        </div>
        <div className="p-5">
          <div className="mb-4">
            <h4 className="font-semibold text-lg mb-2">被害想定</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>建物の浸水被害</li>
              <li>電気系統のショート・故障</li>
              <li>重要書類・データの損失</li>
              <li>業務の長期停止</li>
              <li>在庫・商品の損害</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-2">対策ポイント</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>止水板・土嚢の準備</li>
              <li>重要設備・書類の高所配置</li>
              <li>排水ポンプの設置</li>
              <li>浸水警報装置の設置</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
