import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// 從環境變數讀取 Groq API Key
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: '請提供問題' }, { status: 400 });
    }

    // 如果沒有 API key，使用備用回應
    if (!GROQ_API_KEY) {
      console.warn("Groq API key 未設定，使用備用回應");
      return NextResponse.json({
        response: getFallbackResponse(prompt),
        source: 'fallback'
      });
    }

    try {
      const groq = new Groq({
        apiKey: GROQ_API_KEY,
      });

      const systemPrompt = `你是一個泰雅語學習助教。請遵循以下規則：

重要：絕對不要在回應中顯示任何思考過程、標籤或技術性內容。直接給出最終答案。

你的任務：
1. 用繁體中文回答關於泰雅語的問題
2. 適當時提供泰雅語範例（用中文註明發音和意思）
3. 提供學習建議和記憶技巧
4. 鼓勵學習者持續學習
5. 糾正常見的發音或語法錯誤

回應風格：
- 保持友善、耐心和專業
- 避免使用 markdown 格式符號（如 **, ##, 等）
- 使用簡潔清楚的純文字格式
- 每個回應都要鼓勵學習

範例回應格式：
Sna'u！（發音：斯那烏，意思：你好）
很高興你開始學習泰雅語！建議從基礎發音開始練習...`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile", // Groq 最新免費模型
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        stream: false,
      });

      let response = chatCompletion.choices[0]?.message?.content || "抱歉，我現在無法回答您的問題。請稍後再試。";

      // 清理回應中的思考過程標籤和 markdown 符號
      response = cleanResponse(response);

      return NextResponse.json({
        response,
        source: 'groq'
      });
    } catch (error) {
      console.error("Groq API 錯誤:", error);

      // 根據錯誤類型提供不同的處理
      if (error instanceof Error) {
        if (error.message.includes('Invalid API Key')) {
          console.warn("API key 無效，使用備用回應");
        } else if (error.message.includes('Rate limit')) {
          console.warn("API 速率限制，使用備用回應");
        }
      }

      // 使用備用回應
      return NextResponse.json({
        response: getFallbackResponse(prompt),
        source: 'fallback'
      });
    }
  } catch (error) {
    console.error("API 路由錯誤:", error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}

// 備用聊天回應（當 API 不可用時）
function getFallbackResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  // 特別處理問候語
  if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('你好') || lowerPrompt.includes('哈囉')) {
    return "Sna'u！（發音：斯那烏，意思：你好）\n\n很高興見到你！我是泰雅語學習助教。泰雅語是台灣珍貴的原住民語言，有著豐富的文化內涵。\n\n建議從基礎問候語入手，每天多練習幾句，慢慢累積詞彙量。你可以先學會：\n\n• Sna'u（你好）\n• Mhway su ga？（你好嗎？）\n• Lokah！（很好！）\n• Yaba/Yaya（爸爸/媽媽）\n\n你想從哪裡開始學習呢？我會根據你的需求提供個人化的學習建議。記住，學習語言最重要的是持續練習，不要害怕犯錯！";
  }

  // 根據關鍵字提供相關回應
  if (lowerPrompt.includes('發音') || lowerPrompt.includes('音') || lowerPrompt.includes('聽')) {
    const pronunciationResponses = [
      "泰雅語的發音很重要！建議您：\n1. 多使用發音教室練習\n2. 重複聽取標準音檔\n3. 特別注意母音 a、i、u、e、o 的發音\n4. 練習子音時要注意口型和舌位",
      "發音是學習泰雅語的基礎。請多利用平台的音檔功能，反覆練習每個字母的發音。記住，泰雅語有一些中文沒有的音素，需要多加練習。",
      "建議從母音開始練習發音：\n• a - 如中文「啊」\n• i - 如中文「衣」\n• u - 如中文「烏」\n• e - 如中文「耶」\n• o - 如中文「喔」"
    ];
    return pronunciationResponses[Math.floor(Math.random() * pronunciationResponses.length)];
  }

  if (lowerPrompt.includes('詞彙') || lowerPrompt.includes('單字') || lowerPrompt.includes('意思')) {
    const vocabularyResponses = [
      "學習泰雅語詞彙的小技巧：\n1. 從日常用語開始學習\n2. 將新詞彙與情境結合記憶\n3. 練習造句來加深印象\n4. 定期複習已學的詞彙",
      "泰雅語有豐富的詞彙系統。建議您按照平台的週次進度學習：第二週專門學習詞彙，包含家族、身體、動物、物品等主題。",
      "記憶泰雅語詞彙的方法：\n• 聯想記憶法\n• 圖像記憶法\n• 重複練習法\n• 情境應用法"
    ];
    return vocabularyResponses[Math.floor(Math.random() * vocabularyResponses.length)];
  }

  if (lowerPrompt.includes('語法') || lowerPrompt.includes('句型') || lowerPrompt.includes('文法')) {
    const grammarResponses = [
      "泰雅語的語法結構和中文有所不同。主要特點：\n1. 動詞變位系統\n2. 主謂賓語序\n3. 豐富的詞綴變化\n建議多看例句來熟悉語法結構。",
      "學習泰雅語語法的建議：\n• 先掌握基本句型\n• 注意動詞的時態變化\n• 學習常用的詞綴\n• 多練習造句",
      "泰雅語語法學習重點：\n1. 理解動詞焦點系統\n2. 掌握代詞的使用\n3. 學會疑問句的構造\n4. 練習否定句的表達"
    ];
    return grammarResponses[Math.floor(Math.random() * grammarResponses.length)];
  }

  if (lowerPrompt.includes('學習') || lowerPrompt.includes('怎麼') || lowerPrompt.includes('如何')) {
    const learningResponses = [
      "學習泰雅語的有效方法：\n1. 每天固定時間練習\n2. 從發音基礎開始\n3. 循序漸進學習詞彙\n4. 多與母語使用者交流\n5. 善用學習平台的各種功能",
      "建議您跟著平台的3週學習計畫：\n• 第1週：字母與發音\n• 第2週：生活主題單字\n• 第3週：神話與歷史文本\n每完成一天的課程都有遊戲加強學習效果！",
      "泰雅語學習小提醒：\n• 持續性比強度更重要\n• 不要害怕犯錯\n• 多聽多說多練習\n• 善用發音教室功能\n• 完成測驗來檢視學習成果"
    ];
    return learningResponses[Math.floor(Math.random() * learningResponses.length)];
  }

  // 一般回應
  const generalResponses = [
    "很好的問題！泰雅語是台灣珍貴的原住民語言。建議您多利用平台的各種學習功能，從發音教室開始，再按照週次進度學習。",
    "歡迎學習泰雅語！這是一個非常美麗的語言。記住，語言學習需要時間和耐心，持續練習是關鍵。",
    "學習泰雅語的過程中有任何問題都很正常。建議您多使用平台的音檔功能，並且按部就班完成每週的學習內容。",
    "泰雅語的學習之路很有趣！記得多練習發音，善用遊戲化學習，每天進步一點點就很棒了。",
    "感謝您對泰雅語的興趣！語言是文化的載體，學習泰雅語不僅是技能的提升，更是文化的傳承。"
  ];

  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

// 清理回應中的思考過程標籤和格式符號
function cleanResponse(response: string): string {
  // 移除思考過程標籤
  response = response.replace(/<think>[\s\S]*?<\/think>/gi, '');
  response = response.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');

  // 移除多餘的 markdown 格式符號（但保留基本的換行格式）
  response = response.replace(/\*\*(.*?)\*\*/g, '$1'); // 移除粗體
  response = response.replace(/\*(.*?)\*/g, '$1'); // 移除斜體
  response = response.replace(/#{1,6}\s/g, ''); // 移除標題符號
  response = response.replace(/`([^`]+)`/g, '$1'); // 移除代碼標記

  // 清理多餘的空行
  response = response.replace(/\n{3,}/g, '\n\n');
  response = response.trim();

  return response;
}
