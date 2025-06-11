import { DayData } from './week1';

// 第4週｜實用情境對話：句型導向會話訓練
export const week4: DayData[] = [
  {
    day: 1,
    title: "基本自我介紹與姓名",
    content: [
      { type: "text", value: "🔹 單元一：基本自我介紹與姓名" },
      { type: "text", value: "📘 主句型：" },
      { type: "text", value: "ima' qu isu' wah?（請自我介紹）" },
      { type: "text", value: "ima' lalu' su'?（你叫什麼名字）" },
      { type: "text", value: "___ lalu' mu.（我叫 ___）" },
      { type: "audio", src: "/alphabet/i.webm" },
      { type: "text", value: "💡 使用說明：" },
      { type: "text", value: "- ima'：什麼（疑問詞）" },
      { type: "text", value: "- lalu'：名字" },
      { type: "text", value: "- su'：你的" },
      { type: "text", value: "- mu：我的" },
      { type: "text", value: "📝 對話練習：" },
      { type: "text", value: "A: 「ima' lalu' su'？」（你叫什麼名字？）" },
      { type: "text", value: "B: 「Yumin lalu' mu」（我叫 Yumin）" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「你叫什麼名字？」的泰雅語是？",
        options: ["ima' lalu' su'?", "ima' kawas mu?", "ima' kinwagiq mu?"],
        answer: "ima' lalu' su'?",
        type: "single"
      },
      {
        id: "q2",
        question: "「我叫 Yumin」的泰雅語是？",
        options: ["Yumin lalu' mu", "Yumin kawas mu", "Yumin su'"],
        answer: "Yumin lalu' mu",
        type: "single"
      }
    ],
    game: "VocabularyMemory",
    xp: 90,
  },
  {
    day: 2,
    title: "年齡與族群身分",
    content: [
      { type: "text", value: "🔹 單元二：年齡與族群身分" },
      { type: "text", value: "📘 主句型：" },
      { type: "text", value: "mopuw kawas maku' ___（我 ___ 歲）" },
      { type: "text", value: "'tayal su' inu' wah?（你是哪一族的小孩？）" },
      { type: "text", value: "'laqi' saku' na 'Tayal（我是泰雅族的小孩）" },
      { type: "audio", src: "/alphabet/m.webm" },
      { type: "text", value: "💡 數字詞彙：" },
      { type: "text", value: "- ten：十" },
      { type: "text", value: "- spat：四" },
      { type: "text", value: "- mopuw spat kawas：十四歲" },
      { type: "text", value: "📝 對話練習：" },
      { type: "text", value: "A: 「'tayal su' inu' wah？」（你是哪一族的？）" },
      { type: "text", value: "B: 「'laqi' saku' na 'Tayal」（我是泰雅族的小孩）" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「我是泰雅族的小孩」的泰雅語是？",
        options: ["'laqi' saku' na 'Tayal", "'laqi' su' na 'Tayal", "'Tayal saku' na 'laqi'"],
        answer: "'laqi' saku' na 'Tayal",
        type: "single"
      },
      {
        id: "q2",
        question: "「我十八歲」的泰雅語是？",
        options: ["mopuw spat kawas maku'", "mopuw ten kawas maku'", "spat kawas maku'"],
        answer: "mopuw spat kawas maku'",
        type: "single"
      }
    ],
    game: "ListeningQuiz",
    xp: 90,
  },
  {
    day: 3,
    title: "我的家人是...",
    content: [
      { type: "text", value: "🔹 單元三：我的家人是..." },
      { type: "text", value: "📘 主句型：" },
      { type: "text", value: "'tayal kwara' qu ngasal mamu?（你的家人都是原住民嗎？）" },
      { type: "text", value: "'Tayal kwara' sami qutux ngasal（我們全家都是泰雅族）" },
      { type: "text", value: "iyat, yaba' maku' ga 'Tayal, yaya' maku' ga plmukan（不是，我爸是泰雅族，我媽是漢人）" },
      { type: "audio", src: "/alphabet/t.webm" },
      { type: "text", value: "💡 重要詞彙：" },
      { type: "text", value: "- kwara'：都、全部" },
      { type: "text", value: "- ngasal：家人" },
      { type: "text", value: "- iyat：不是" },
      { type: "text", value: "- plmukan：漢人" },
      { type: "text", value: "📝 練習回答是否題：" },
      { type: "text", value: "\"iyat\" 表示「不是」✅ 正確" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「不是」的泰雅語是？",
        options: ["iyat", "uwal", "ini"],
        answer: "iyat",
        type: "single"
      },
      {
        id: "q2",
        question: "「我們全家都是泰雅族」的泰雅語是？",
        options: ["'Tayal kwara' sami qutux ngasal", "'Tayal sami kwara'", "sami 'Tayal ngasal"],
        answer: "'Tayal kwara' sami qutux ngasal",
        type: "single"
      }
    ],
    game: "PronunciationPractice",
    xp: 90,
  },
  {
    day: 4,
    title: "誰是我的家人？",
    content: [
      { type: "text", value: "🔹 單元四：誰是我的家人？" },
      { type: "text", value: "📘 主句型：" },
      { type: "text", value: "'laqi' su' ni ima?（你是誰的小孩？）" },
      { type: "text", value: "'laqi' saku' ni Silan Nawi（我是 Silan Nawi 的小孩）" },
      { type: "text", value: "qasa ga yaba' su'?（那位是你爸爸嗎？）" },
      { type: "audio", src: "/alphabet/l.webm" },
      { type: "text", value: "💡 疑問詞彙：" },
      { type: "text", value: "- ni ima：誰的" },
      { type: "text", value: "- qasa：那位、那個" },
      { type: "text", value: "- yaba'：爸爸" },
      { type: "text", value: "- yaya'：媽媽" },
      { type: "text", value: "📝 句型配對練習：" },
      { type: "text", value: "Q：「你幾歲？」對應：「pira' kawas mu?」" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「你是誰的小孩？」的泰雅語是？",
        options: ["'laqi' su' ni ima?", "'laqi' ima su'?", "ni ima 'laqi' su'?"],
        answer: "'laqi' su' ni ima?",
        type: "single"
      },
      {
        id: "q2",
        question: "「你幾歲？」的泰雅語是？",
        options: ["pira' kawas mu?", "ima' kawas mu?", "ktwa' kawas mu?"],
        answer: "pira' kawas mu?",
        type: "single"
      }
    ],
    game: "VocabularyMemory",
    xp: 90,
  },
  {
    day: 5,
    title: "年紀、身高與總複習",
    content: [
      { type: "text", value: "🔹 單元五：年紀、身高" },
      { type: "text", value: "📘 主句型：" },
      { type: "text", value: "👧 A: Pira' kawas mu?（你幾歲？）" },
      { type: "text", value: "🧒 B: Mopuw spat kawas maku'.（我十八歲。）" },
      { type: "text", value: "👧 A: Ktwa' kinwagiq mu?（你多高？）" },
      { type: "text", value: "🧒 B: Kbhul ru mspatul inci.（我一百四十公分。）" },
      { type: "audio", src: "/alphabet/k.webm" },
      { type: "text", value: "💡 身高詞彙：" },
      { type: "text", value: "- kinwagiq：身高" },
      { type: "text", value: "- kbhul：一百" },
      { type: "text", value: "- mspatul：四十" },
      { type: "text", value: "- inci：公分" },
      { type: "text", value: "🎯 第四週總複習：自我介紹完整對話訓練" },
      { type: "text", value: "恭喜完成實用情境對話學習！您已經能夠進行基本的泰雅語自我介紹了。" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「我一百四十公分」的泰雅語是？",
        options: ["Kbhul ru mspatul inci.", "Mspatul kbhul inci.", "Kbhul mspatul."],
        answer: "Kbhul ru mspatul inci.",
        type: "single"
      },
      {
        id: "q2",
        question: "「你多高？」的泰雅語是？",
        options: ["Ktwa' kinwagiq mu?", "Pira' kinwagiq mu?", "Ima' kinwagiq mu?"],
        answer: "Ktwa' kinwagiq mu?",
        type: "single"
      },
      {
        id: "q3",
        question: "完整自我介紹包含姓名和年齡，正確順序是？",
        options: ["先說姓名再說年齡", "先說年齡再說姓名", "只說姓名就好"],
        answer: "先說姓名再說年齡",
        type: "single"
      }
    ],
    game: "ListeningQuiz",
    xp: 110,
  }
]; 