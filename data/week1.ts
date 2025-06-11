export interface ContentItem {
  type: 'text' | 'audio' | 'image';
  value?: string;
  src?: string;
  alt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  type?: 'single' | 'drag' | 'fill';
}

export interface DayData {
  day: number;
  title: string;
  content: ContentItem[];
  quiz: QuizQuestion[];
  game: string;
  xp: number;
}

// 音檔已放置於 /public/alphabet/ 資料夾中（webm格式）
export const week1: DayData[] = [
  {
    day: 1,
    title: "母音 a",
    content: [
      { type: "text", value: "泰雅語字母 a 的發音學習。a 發音如同中文的「啊」，是一個開口音。" },
      { type: "audio", src: "/alphabet/a.webm" },
      { type: "text", value: "常見單字：aba (爸爸)、ana (媽媽)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "字母 a 的示例單字「爸爸」是？",
        options: ["aba", "aya", "abaw"],
        answer: "aba",
        type: "single"
      },
      {
        id: "q2", 
        question: "字母 a 的示例單字「媽媽」是？",
        options: ["ana", "aya", "ata"],
        answer: "ana",
        type: "single"
      }
    ],
    game: "LetterMatch",
    xp: 50,
  },
  {
    day: 2,
    title: "母音 i",
    content: [
      { type: "text", value: "泰雅語字母 i 的發音學習。i 發音如同中文的「衣」。" },
      { type: "audio", src: "/alphabet/i.webm" },
      { type: "text", value: "常見單字：ima (血)、itaal (看)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "字母 i 的示例單字「血」是？",
        options: ["ima", "iya", "ita"],
        answer: "ima",
        type: "single"
      }
    ],
    game: "LetterMatch",
    xp: 50,
  },
  {
    day: 3,
    title: "母音 u",
    content: [
      { type: "text", value: "泰雅語字母 u 的發音學習。u 發音如同中文的「烏」。" },
      { type: "audio", src: "/alphabet/u.webm" },
      { type: "text", value: "常見單字：uzi (水)、utux (靈魂)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "字母 u 的示例單字「水」是？",
        options: ["uzi", "uru", "utu"],
        answer: "uzi",
        type: "single"
      }
    ],
    game: "LetterMatch", 
    xp: 50,
  },
  {
    day: 4,
    title: "母音 e",
    content: [
      { type: "text", value: "泰雅語字母 e 的發音學習。e 發音如同中文的「耶」。" },
      { type: "audio", src: "/alphabet/e.webm" },
      { type: "text", value: "常見單字：emaw (爺爺)、ebaw (奶奶)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "字母 e 的示例單字「爺爺」是？",
        options: ["emaw", "ebaw", "etaw"],
        answer: "emaw",
        type: "single"
      }
    ],
    game: "LetterMatch",
    xp: 50,
  },
  {
    day: 5,
    title: "母音 o",
    content: [
      { type: "text", value: "泰雅語字母 o 的發音學習。o 發音如同中文的「喔」。" },
      { type: "audio", src: "/alphabet/o.webm" },
      { type: "text", value: "常見單字：owa (是的)、owal (煮)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "字母 o 的示例單字「是的」是？",
        options: ["owa", "ora", "ota"],
        answer: "owa",
        type: "single"
      }
    ],
    game: "LetterMatch",
    xp: 50,
  },
  {
    day: 6,
    title: "複習母音",
    content: [
      { type: "text", value: "讓我們複習本週學習的五個母音：a, i, u, e, o" },
      { type: "text", value: "練習發音並記住每個母音的代表單字。" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「爸爸」的泰雅語是？",
        options: ["aba", "ana", "owa"],
        answer: "aba",
        type: "single"
      },
      {
        id: "q2",
        question: "「水」的泰雅語是？",
        options: ["ima", "uzi", "owa"],
        answer: "uzi", 
        type: "single"
      }
    ],
    game: "LetterMatch",
    xp: 75,
  },
  {
    day: 7,
    title: "母音總測驗",
    content: [
      { type: "text", value: "第一週總測驗：測試您對泰雅語母音的掌握程度。" },
      { type: "text", value: "完成測驗後即可解鎖第二週課程！" },
    ],
    quiz: [
      {
        id: "q1",
        question: "以下哪個是「媽媽」的正確發音？",
        options: ["aba", "ana", "awa"],
        answer: "ana",
        type: "single"
      },
      {
        id: "q2",
        question: "「靈魂」的泰雅語是？", 
        options: ["utux", "utul", "utal"],
        answer: "utux",
        type: "single"
      },
      {
        id: "q3",
        question: "「爺爺」的泰雅語是？",
        options: ["emaw", "ebaw", "elaw"],
        answer: "emaw",
        type: "single"
      }
    ],
    game: "LetterMatch",
    xp: 100,
  }
]; 