import { NextResponse } from 'next/server';

// Hugging Face Whisper API 配置
const API_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3";
const HF_TOKEN = process.env.HF_TOKEN;

/**
 * 處理來自客戶端的 POST 請求，將音檔轉發到 Hugging Face API 進行語音辨識
 * @param {Request} request - Next.js 請求對象
 * @returns {NextResponse} - Next.js 回應對象
 */
export async function POST(request: Request) {
  try {
    // 1. 檢查 API 金鑰是否存在
    if (!HF_TOKEN) {
      console.error("Hugging Face API 金鑰未設定");
      return NextResponse.json(
        { error: "伺服器設定錯誤，請聯繫管理員" },
        { status: 500 }
      );
    }

    // 2. 從請求中獲取音檔數據 (Blob)
    const audioBlob = await request.blob();
    if (!audioBlob || audioBlob.size === 0) {
      return NextResponse.json({ error: "沒有收到音檔" }, { status: 400 });
    }

    // 3. 呼叫 Hugging Face API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": audioBlob.type,
      },
      body: audioBlob,
    });

    // 4. 處理 API 回應
    const result = await response.json();

    if (!response.ok) {
      console.error("Hugging Face API 錯誤:", result);
      const errorMessage = result.error || "語音辨識服務暫時無法使用";
      // 如果 Hugging Face 模型正在加載，提供更友善的提示
      if (typeof errorMessage === 'string' && errorMessage.includes("is currently loading")) {
          return NextResponse.json(
            { error: "辨識模型正在啟動中，請稍後再試一次。" },
            { status: 503 } 
          );
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }
    
    // 5. 將辨識結果回傳給前端
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("處理音檔時發生未預期錯誤:", error);
    return NextResponse.json(
      { error: "伺服器內部錯誤，無法處理您的請求" },
      { status: 500 }
    );
  }
} 