import { DayData } from './week1';

// TODO: 之後請手動貼入完整教材與音檔路徑
export const week4: DayData[] = [
  {
    day: 1,
    title: "基本打招呼",
    content: [
      { type: "text", value: "學習泰雅語的基本打招呼用語。" },
      { type: "audio", src: "/audio/week4/greetings.mp3" },
      { type: "text", value: "打招呼：Lokah su? (你好嗎？) / Lokah saku. (我很好)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「你好嗎？」的泰雅語是？",
        options: ["Lokah su?", "Lokah saku?", "Lokah ta?"],
        answer: "Lokah su?",
        type: "single"
      },
      {
        id: "q2",
        question: "「我很好」的泰雅語是？",
        options: ["Lokah su.", "Lokah saku.", "Lokah ta."],
        answer: "Lokah saku.",
        type: "single"
      }
    ],
    game: "SentencePuzzle",
    xp: 80,
  },
  {
    day: 2,
    title: "自我介紹",
    content: [
      { type: "text", value: "學習泰雅語的自我介紹句型。" },
      { type: "audio", src: "/audio/week4/introduction.mp3" },
      { type: "text", value: "自我介紹：Yaki saku ___. (我的名字是___)、Sqani saku. (我是___人)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「我的名字是」的泰雅語開頭是？",
        options: ["Yaki saku", "Yaki su", "Yaki ta"],
        answer: "Yaki saku",
        type: "single"
      }
    ],
    game: "SentencePuzzle",
    xp: 80,
  },
  {
    day: 3,
    title: "詢問與回答",
    content: [
      { type: "text", value: "學習泰雅語的疑問句與回答方式。" },
      { type: "audio", src: "/audio/week4/questions.mp3" },
      { type: "text", value: "疑問句：Nanu su? (你是什麼？) / Ima su? (你是誰？) / Inu su? (你在哪裡？)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「你是誰？」的泰雅語是？",
        options: ["Ima su?", "Nanu su?", "Inu su?"],
        answer: "Ima su?",
        type: "single"
      },
      {
        id: "q2",
        question: "「你在哪裡？」的泰雅語是？",
        options: ["Ima su?", "Nanu su?", "Inu su?"],
        answer: "Inu su?",
        type: "single"
      }
    ],
    game: "SentencePuzzle",
    xp: 80,
  },
  {
    day: 4,
    title: "日常對話",
    content: [
      { type: "text", value: "學習泰雅語的日常對話表達。" },
      { type: "audio", src: "/audio/week4/daily_talk.mp3" },
      { type: "text", value: "日常用語：Kmal lokah! (真的很好！) / Ayaw kira! (不要這樣！) / Musa ta! (我們走吧！)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「真的很好！」的泰雅語是？",
        options: ["Kmal lokah!", "Kmal balay!", "Kmal gaga!"],
        answer: "Kmal lokah!",
        type: "single"
      },
      {
        id: "q2",
        question: "「我們走吧！」的泰雅語是？",
        options: ["Musa ta!", "Musa saku!", "Musa su!"],
        answer: "Musa ta!",
        type: "single"
      }
    ],
    game: "SentencePuzzle",
    xp: 80,
  },
  {
    day: 5,
    title: "感謝與道歉",
    content: [
      { type: "text", value: "學習泰雅語的感謝與道歉表達。" },
      { type: "audio", src: "/audio/week4/thanks_sorry.mp3" },
      { type: "text", value: "禮貌用語：Sbalay! (謝謝！) / Kinbahan saku. (對不起) / Isu balay. (不客氣)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「謝謝！」的泰雅語是？",
        options: ["Sbalay!", "Sbaway!", "Sbaraw!"],
        answer: "Sbalay!",
        type: "single"
      },
      {
        id: "q2",
        question: "「對不起」的泰雅語是？",
        options: ["Kinbahan saku.", "Kinbalay saku.", "Kinbaway saku."],
        answer: "Kinbahan saku.",
        type: "single"
      }
    ],
    game: "SentencePuzzle",
    xp: 80,
  },
  {
    day: 6,
    title: "對話複習",
    content: [
      { type: "text", value: "複習本週學習的各種對話表達：打招呼、介紹、詢問、日常、禮貌用語。" },
      { type: "audio", src: "/audio/week4/conversation_review.mp3" },
      { type: "text", value: "練習組合這些句型進行完整對話。" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「不客氣」的泰雅語是？",
        options: ["Isu balay.", "Isu lokah.", "Isu gaga."],
        answer: "Isu balay.",
        type: "single"
      },
      {
        id: "q2",
        question: "「不要這樣！」的泰雅語是？",
        options: ["Ayaw kira!", "Ayaw kiya!", "Ayaw kisa!"],
        answer: "Ayaw kira!",
        type: "single"
      },
      {
        id: "q3",
        question: "「你是什麼？」的泰雅語是？",
        options: ["Nanu su?", "Ima su?", "Inu su?"],
        answer: "Nanu su?",
        type: "single"
      }
    ],
    game: "SentencePuzzle",
    xp: 100,
  },
  {
    day: 7,
    title: "對話總測驗",
    content: [
      { type: "text", value: "第四週總測驗：測試您對泰雅語對話的掌握程度。" },
      { type: "text", value: "恭喜您即將完成整個學習課程！" },
    ],
    quiz: [
      {
        id: "q1",
        question: "完整的打招呼對話，「你好嗎？」「我很好」依序是？",
        options: ["Lokah su? / Lokah saku.", "Ima su? / Yaki saku.", "Nanu su? / Kmal lokah."],
        answer: "Lokah su? / Lokah saku.",
        type: "single"
      },
      {
        id: "q2",
        question: "自我介紹「我的名字是___」的正確句型是？",
        options: ["Yaki saku ___.", "Ima saku ___.", "Nanu saku ___."],
        answer: "Yaki saku ___.",
        type: "single"
      },
      {
        id: "q3",
        question: "感謝對方後，對方回應「不客氣」的完整對話是？",
        options: ["Sbalay! / Isu balay.", "Lokah! / Kmal lokah.", "Musa! / Ayaw kira."],
        answer: "Sbalay! / Isu balay.",
        type: "single"
      },
      {
        id: "q4",
        question: "「對不起」的正確泰雅語表達是？",
        options: ["Kinbahan saku.", "Kinbalay saku.", "Sbalay saku."],
        answer: "Kinbahan saku.",
        type: "single"
      }
    ],
    game: "SentencePuzzle",
    xp: 160,
  }
]; 