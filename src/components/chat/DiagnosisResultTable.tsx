
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface DiagnosisResultItem {
  category: string;
  productName: string;
  quantity: string;
}

interface DiagnosisResultTableProps {
  items: DiagnosisResultItem[];
  budget?: number;
}

export const DiagnosisResultTable = ({ items, budget }: DiagnosisResultTableProps) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReportOpen(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Removing the redundant toast notification that appears on component mount

  const categorizedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, DiagnosisResultItem[]>);

  const enhancedCategories: Record<string, string> = {
    "食品類": "災害時の栄養補給と生存に必須のアイテムです。長期保存が可能で、調理不要の食品が理想的です。",
    "飲料水・給水用品類": "人間が生存するために最も重要な水の確保のためのアイテムです。最低3日分の備蓄が推奨されています。",
    "トイレ用品類": "災害時にはライフラインが止まり、トイレが使用できなくなる可能性があります。衛生管理のために重要です。",
    "衛生用品類": "感染症予防や怪我の処置など、健康維持のために必要不可欠なアイテムです。",
    "防災用具類": "避難時や被災時の安全確保と生活維持のために必要な道具類です。",
    "情報・通信類": "災害時の情報収集や通信手段の確保は、状況把握や救助要請のために非常に重要です。",
    "防寒・暑さ対策": "季節や気候に応じた体温調節は生存率を大きく左右します。",
    "避難・緊急脱出用品": "迅速かつ安全に避難するために必要なアイテムです。特に都市部での緊急脱出に重要です。"
  };
  
  const productReasons: Record<string, string> = {
    "アルファ米": "調理不要で長期保存可能。お湯や水を入れるだけで食べられるため、災害時に便利です。",
    "フリーズドライご飯": "軽量で保存期間が長く、栄養価も保持されています。調理が簡単なのが特徴です。",
    "缶詰": "長期保存が可能で、そのまま食べられるため災害時の貴重な栄養源になります。",
    "保存水": "清潔な飲料水の確保は生存のために最も重要です。1人1日3リットルを目安に備蓄してください。",
    "給水バッグ": "断水時に給水所から水を運ぶために必要です。折りたたんでコンパクトに保管できます。",
    "携帯浄水器": "河川や雨水など、不確かな水源から飲料水を確保するために役立ちます。",
    "大容量給水タンク": "家族や団体での水の備蓄に適しています。給水所からの運搬にも使えます。",
    "非常用トイレ（単品・少回数）": "水洗トイレが使えない状況でも衛生的にトイレを使用できます。",
    "非常用トイレ（ブック収納型）": "コンパクトに収納でき、複数回使用可能なタイプです。長期の避難生活に適しています。",
    "紙おむつ": "乳幼児や高齢者のケアに必須です。また、水が限られた状況での排泄物処理にも役立ちます。",
    "トイレットペーパー": "日常生活と同様に必要です。ティッシュペーパーよりも経済的で節約できます。",
    "防護用品類": "感染症予防や粉塵からの保護に役立ちます。特に避難所生活では重要です。",
    "救急キット": "怪我や病気の初期対応に必要です。消毒液、包帯、絆創膏などの基本的な医療用品を含みます。"
  };

  return (
    <div className="flex flex-col h-full border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-200 p-4">
        <p className="text-sm text-gray-800">
          この備蓄品リストは、避難生活を想定して作成されています。災害状況によって必要物資は変わる場合があります。
        </p>
      </div>
      
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {Object.entries(categorizedItems).map(([category, categoryItems]) => (
              <div key={category} className="mb-8">
                <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2 mb-4">{category}</h2>
                
                {enhancedCategories[category] && (
                  <p className="text-sm text-gray-600 mb-4 italic">{enhancedCategories[category]}</p>
                )}
                
                {categoryItems.map((item, index) => (
                  <div key={`${category}-${index}`} className="mb-4 border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="md:w-1/2">
                        <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                        {productReasons[item.productName] && (
                          <p className="text-sm text-gray-600 mt-1">{productReasons[item.productName]}</p>
                        )}
                      </div>
                      <div className="md:w-1/2 md:text-right mt-2 md:mt-0">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          必要数量: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <div className="bg-gray-100 p-4 border-t border-gray-300 flex justify-between items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="flex items-center cursor-pointer group" 
                onClick={() => {
                  setIsReportOpen(true);
                }}
              >
                <Card className="p-2 border-2 border-blue-500 rounded-full mr-2 group-hover:bg-blue-50 transition-colors duration-200">
                  <div className="w-10 h-10 flex items-center justify-center relative">
                    <Search size={24} className="text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                  </div>
                </Card>
                <div className="text-sm group-hover:text-blue-600 transition-colors duration-200">
                  <span className="font-bold">あなたに想定される</span><br />
                  被害と対策をチェック
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-blue-600 text-white">
              <p>クリックして災害リスク診断レポートを確認</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="p-2 border-2 border-gray-500 rounded-md">
          <div className="text-center">
            <div className="text-sm">予想される費用：</div>
            <div className="font-bold text-xl">{budget ? `${budget.toLocaleString()}円` : "180,000円"}</div>
          </div>
        </div>
      </div>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-5xl w-[90vw] md:w-[80vw]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">災害リスク診断レポート</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="space-y-6 p-2">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-orange-800 mb-2">地震リスク: 高</h3>
                <p className="text-gray-700">
                  あなたの地域は、大規模地震発生の可能性が高いエリアに位置しています。過去の地震データと地質調査に基づくと、今後30年以内にマグニチュード7クラスの地震が発生する確率は70%と推定されます。
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold text-orange-700 mb-1">主な対策ポイント:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>家具の固定や配置の見直し</li>
                    <li>建物の耐震診断と必要に応じた補強</li>
                    <li>ガラス飛散防止フィルムの設置</li>
                    <li>避難経路の確保と家族での避難場所の確認</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-blue-800 mb-2">水害リスク: 中</h3>
                <p className="text-gray-700">
                  あなたの地域は河川から離れていますが、局地的な豪雨による内水氾濫のリスクがあります。近年の気候変動により、短時間での大雨発生頻度が増加傾向にあります。
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold text-blue-700 mb-1">主な対策ポイント:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>ハザードマップでの自宅位置の確認</li>
                    <li>排水溝の定期的な清掃</li>
                    <li>貴重品や電子機器の高所保管</li>
                    <li>避難情報の入手方法の確認</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-red-800 mb-2">火災リスク: 中〜高</h3>
                <p className="text-gray-700">
                  木造家屋が密集している地域では、地震後の火災リスクが高まります。特に冬季や乾燥した気候の時期は注意が必要です。
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold text-red-700 mb-1">主な対策ポイント:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>住宅用火災警報器の設置と定期点検</li>
                    <li>消火器の設置と使用方法の確認</li>
                    <li>通電火災防止のためのブレーカー対策</li>
                    <li>延焼防止のための防火カーテンの検討</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-800 mb-2">停電・断水リスク: 高</h3>
                <p className="text-gray-700">
                  大規模災害時には、1週間以上のライフライン途絶が想定されます。特に高層マンションでは給水ポンプの停止により、水道が止まる可能性があります。
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold text-purple-700 mb-1">主な対策ポイント:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>最低3日分（できれば1週間分）の水と食料の備蓄</li>
                    <li>ポータブル電源や手回し充電器の準備</li>
                    <li>簡易トイレと衛生用品の備蓄</li>
                    <li>カセットコンロと予備ガスの準備</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">総合評価と追加提案</h3>
                <p className="text-gray-700 mb-3">
                  あなたの地域では、地震と地震に伴う二次災害（火災、ライフライン途絶）への備えが特に重要です。今回提案した備蓄品リストは、これらのリスクに対応した内容となっています。
                </p>
                <p className="text-gray-700 mb-3">
                  提案内容に加えて、次のような対策も検討されることをお勧めします：
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>地域の防災訓練への参加</li>
                  <li>家族との定期的な防災会議と避難計画の確認</li>
                  <li>防災アプリのインストールと設定</li>
                  <li>近隣住民との協力体制の構築</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

