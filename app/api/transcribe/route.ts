import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// 使用與 chatbot 相同的 Groq API Key
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

/**
 * 處理來自客戶端的 POST 請求，將音檔轉發到 Groq Whisper API 進行語音辨識
 * @param {Request} request - Next.js 請求對象
 * @returns {NextResponse} - Next.js 回應對象
 */
export async function POST(request: Request) {
  try {
    // 1. 檢查 API 金鑰是否存在
    if (!GROQ_API_KEY) {
      console.error("Groq API 金鑰未設定");
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

    // 3. 將 Blob 轉換為 File 物件（Groq SDK 需要 File 格式）
    // 前端送來的是 WAV 格式
    const audioFile = new File([audioBlob], "audio.wav", {
      type: "audio/wav"
    });

    console.log("音檔大小:", audioBlob.size, "bytes, 類型:", audioBlob.type);

    // 4. 初始化 Groq 客戶端
    const groq = new Groq({
      apiKey: GROQ_API_KEY,
    });

    // 5. 呼叫 Groq Whisper API
    // 不指定 language，讓 Whisper 自動偵測（泰雅語發音可能被辨識為英文或其他語言）
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
      response_format: "json",
    });

    console.log("辨識結果:", transcription.text);

    // 6. 將辨識結果回傳給前端
    // 如果辨識結果為空，回傳空字串而非 undefined
    return NextResponse.json({ text: transcription.text || "" }, { status: 200 });

  } catch (error) {
    console.error("處理音檔時發生未預期錯誤:", error);

    // 提供更詳細的錯誤訊息
    if (error instanceof Error) {
      if (error.message.includes('Invalid API Key')) {
        return NextResponse.json(
          { error: "API 金鑰無效，請檢查設定" },
          { status: 401 }
        );
      }
      if (error.message.includes('Rate limit')) {
        return NextResponse.json(
          { error: "API 請求過於頻繁，請稍後再試" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "語音辨識服務暫時無法使用，請稍後再試" },
      { status: 500 }
    );
  }
}
