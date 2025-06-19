
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI APIキーが設定されていません。環境変数を確認してください。');
    }

    const { userRequest, currentSupplies, fullStockItems, allStockItems } = await req.json();
    
    // ログを追加
    console.log("User request:", userRequest);
    console.log("Current supplies count:", currentSupplies.length);
    console.log("Current supplies:", JSON.stringify(currentSupplies));

    const prompt = `
以下の備蓄品リストから、ユーザーの要求「${userRequest}」によって、不要な備蓄品があれば削除してください。ただしリストを空にしてはいけません。

参考情報として、各備蓄品の詳細データも提供します。これには災害フェーズ(phase)、1人あたり必要量(per_person_qty)、単位(unit)、対応災害種(disaster_types)などが含まれます。
災害種の番号は、1=地震、2=水害、3=土砂災害、4=大雪、に対応しています。

また、データベース内の全ての備蓄品情報も参考として提供します。ユーザーの要求に応じて、別の種類の備蓄品に置き換えたい場合などに活用してください。

JSON形式で3つの部分からなる回答を返してください。
1. "explanation": ユーザーの要求に基づいてどのような変更を行ったかの説明（日本語）
2. "supplies": 更新後の備蓄品リスト（jsonフォーマット）
3. "removedItems": 削除されたアイテムの名前のリスト（配列）

出力は必ず有効な JSON のみで、\`\`\`（コードブロック）やその他の余分な記号は含めないでください。
"supplies"内の各備蓄品のフィールドは name, quantity, category としてください。また出力は以下の備蓄品リストと全く同じ形式で出力してください。形式が変わると動作しなくなります。

備蓄品リスト（簡略版）:
${JSON.stringify(currentSupplies, null, 2)}

現在選択中の備蓄品詳細データ（参考情報）:
${JSON.stringify(fullStockItems, null, 2)}

データベース内の全備蓄品情報（参考情報）:
${JSON.stringify(allStockItems, null, 2)}
`;

    console.log("AI filtration prompt created");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'あなたは備蓄品リストを管理する専門家AIです。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected API response format:", data);
      throw new Error("OpenAI APIからの応答形式が不正です。");
    }
    
    // トークン使用量をログ出力
    if (data.usage) {
      console.log('=== 備蓄品処理 トークン使用量 ===');
      console.log(`入力トークン数: ${data.usage.prompt_tokens}`);
      console.log(`出力トークン数: ${data.usage.completion_tokens}`);
      console.log(`合計トークン数: ${data.usage.total_tokens}`);
      console.log('================================');
    }
    
    const aiResponse = data.choices[0].message.content;
    console.log("AI response:", aiResponse);
    
    // JSONレスポンスをパース
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("AIレスポンスのJSON解析エラー:", parseError);
      throw new Error("AIからの応答を処理できませんでした。有効なJSON形式ではありませんでした。");
    }
    
    // parsedResponseが期待する形式かどうかを確認
    if (!parsedResponse || typeof parsedResponse !== 'object') {
      console.error("AIレスポンスが予期しない形式です:", parsedResponse);
      throw new Error("AIからの応答形式が不正です。");
    }
    
    const newSupplies = parsedResponse.supplies || [];
    const explanation = parsedResponse.explanation || "備蓄品リストを更新しました。";
    const removedItems = parsedResponse.removedItems || [];
    
    // 備蓄品リストが空の場合は元のリストを返す
    if (!Array.isArray(newSupplies) || newSupplies.length === 0) {
      console.error("AIから返された備蓄品リストが空または配列ではありません");
      throw new Error("備蓄品リストを更新できませんでした。AIからの応答に有効な備蓄品データがありませんでした。");
    }
    
    // 現在の備蓄品と更新後の備蓄品の差分をログ出力
    console.log("Before update supplies:", JSON.stringify(currentSupplies));
    console.log("After update supplies:", JSON.stringify(newSupplies));
    
    // 削除されたアイテムを特定
    if (!Array.isArray(removedItems) || removedItems.length === 0) {
      // removed_itemsが提供されていない場合は、元の備蓄品と新しい備蓄品を比較して削除されたアイテムを特定
      const currentNames = currentSupplies.map(item => item.name);
      const newNames = newSupplies.map(item => item.name);
      
      const removedItemsComputed = currentNames.filter(name => !newNames.includes(name));
      if (removedItemsComputed.length > 0) {
        console.log("Removed items:", removedItemsComputed);
      } else {
        console.log("No items were removed.");
      }
      
      return new Response(
        JSON.stringify({ 
          newSupplies, 
          explanation,
          removedItems: removedItemsComputed,
          usage: data.usage // トークン情報を追加
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } else {
      console.log("Removed items from AI:", removedItems);
      
      return new Response(
        JSON.stringify({ 
          newSupplies, 
          explanation,
          removedItems,
          usage: data.usage // トークン情報を追加
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        newSupplies: null,
        explanation: "申し訳ありません。備蓄品リストの処理中にエラーが発生しました。" 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
