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

// 第1週｜字母與發音：建立聲音基礎
export const week1: DayData[] = [
  {
    day: 1,
    title: "母音學習 a、i、u",
    content: [
      { type: "text", value: "第一天學習三個重要母音：a、i、u" },
      { type: "text", value: "母音 a：發音如同中文「啊」" },
      { type: "audio", src: "/alphabet/a.wav" },
      { type: "text", value: "單字：aba (爸爸)、abaw (葉子)" },
      { type: "text", value: "母音 i：發音如同中文「衣」" },
      { type: "audio", src: "/alphabet/i.wav" },
      { type: "text", value: "單字：cyugal (三)、enpic (鉛筆)" },
      { type: "text", value: "母音 u：發音如同中文「烏」" },
      { type: "audio", src: "/alphabet/u.wav" },
      { type: "text", value: "練習發音，記住每個母音的特色。" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「爸爸」的泰雅語是？",
        options: ["aba", "aya", "abaw"],
        answer: "aba",
        type: "single"
      },
      {
        id: "q2",
        question: "「三」的泰雅語是？",
        options: ["cyugal", "cyama", "cingal"],
        answer: "cyugal",
        type: "single"
      }
    ],
    game: "LetterMatch",
    xp: 60,
  },
  {
    day: 2,
    title: "母音學習 e、o + 子音 g、l、s",
    content: [
      { type: "text", value: "學習剩下的母音 e、o 和第一組子音" },
      { type: "text", value: "母音 e：發音如同中文「耶」" },
      { type: "audio", src: "/alphabet/e.wav" },
      { type: "text", value: "單字：ega (電影)" },
      { type: "text", value: "母音 o：發音如同中文「喔」" },
      { type: "audio", src: "/alphabet/o.wav" },
      { type: "text", value: "子音 g、l、s 的發音學習" },
      { type: "audio", src: "/alphabet/g.wav" },
      { type: "audio", src: "/alphabet/l.wav" },
      { type: "audio", src: "/alphabet/s.wav" },
      { type: "text", value: "單字：gamil (根)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「電影」的泰雅語是？",
        options: ["ega", "eta", "ena"],
        answer: "ega",
        type: "single"
      },
      {
        id: "q2",
        question: "「根」的泰雅語是？",
        options: ["gamil", "gasil", "gamal"],
        answer: "gamil",
        type: "single"
      }
    ],
    game: "ListeningQuiz",
    xp: 60,
  },
  {
    day: 3,
    title: "子音學習 b、h、m、p、t、y",
    content: [
      { type: "text", value: "學習第二組子音：b、h、m、p、t、y" },
      { type: "audio", src: "/alphabet/b.wav" },
      { type: "audio", src: "/alphabet/h.wav" },
      { type: "audio", src: "/alphabet/m.wav" },
      { type: "audio", src: "/alphabet/p.wav" },
      { type: "audio", src: "/alphabet/t.wav" },
      { type: "audio", src: "/alphabet/y.wav" },
      { type: "text", value: "單字練習：basu (車子)、bonaw (花生)" },
      { type: "text", value: "注意每個子音的發音位置和方式。" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「車子」的泰雅語是？",
        options: ["basu", "batu", "banu"],
        answer: "basu",
        type: "single"
      },
      {
        id: "q2",
        question: "「花生」的泰雅語是？",
        options: ["bonaw", "benaw", "banaw"],
        answer: "bonaw",
        type: "single"
      }
    ],
    game: "PronunciationPractice", 
    xp: 60,
  },
  {
    day: 4,
    title: "子音學習 c、n、q、z + 單字練習",
    content: [
      { type: "text", value: "學習第三組子音：c、n、q、z" },
      { type: "audio", src: "/alphabet/c.wav" },
      { type: "audio", src: "/alphabet/n.wav" },
      { type: "audio", src: "/alphabet/q.wav" },
      { type: "audio", src: "/alphabet/z.wav" },
      { type: "text", value: "單字練習：cyama (商店)" },
      { type: "text", value: "複習之前學過的詞彙：aya (媽媽)" },
      { type: "text", value: "練習拼讀含有這些子音的單字。" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「商店」的泰雅語是？",
        options: ["cyama", "cyata", "cyala"],
        answer: "cyama",
        type: "single"
      },
      {
        id: "q2",
        question: "「媽媽」的泰雅語是？",
        options: ["aya", "aba", "ana"],
        answer: "aya",
        type: "single"
      }
    ],
    game: "LetterMatch",
    xp: 60,
  },
  {
    day: 5,
    title: "剩餘子音與總複習",
    content: [
      { type: "text", value: "學習最後一組子音：k、ng、r、w、x、'" },
      { type: "audio", src: "/alphabet/k.wav" },
      { type: "audio", src: "/alphabet/ng.wav" },
      { type: "audio", src: "/alphabet/r.wav" },
      { type: "audio", src: "/alphabet/w.wav" },
      { type: "audio", src: "/alphabet/x.wav" },
      { type: "text", value: "聲門塞音 '：這是泰雅語的特殊子音，發音時聲門突然閉合再打開" },
      { type: "audio", src: "/alphabet/'.wav" },
      { type: "text", value: "第一週總複習：母音5個 + 子音19個" },
      { type: "text", value: "複習所有學過的詞彙：aba、aya、abaw、gamil、basu、bonaw、cyugal、cyama、ega、enpic" },
      { type: "text", value: "恭喜完成第一週的字母與發音學習！" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「鉛筆」的泰雅語是？",
        options: ["enpic", "epsic", "entic"],
        answer: "enpic",
        type: "single"
      },
      {
        id: "q2",
        question: "「葉子」的泰雅語是？",
        options: ["abaw", "abay", "alaw"],
        answer: "abaw",
        type: "single"
      },
      {
        id: "q3",
        question: "泰雅語總共有幾個子音？",
        options: ["17個", "19個", "21個"],
        answer: "19個",
        type: "single"
      },
      {
        id: "q4",
        question: "聲門塞音 ' 的發音特色是？",
        options: ["聲門突然閉合再打開", "舌尖輕彈", "氣流摩擦"],
        answer: "聲門突然閉合再打開",
        type: "single"
      }
    ],
    game: "ListeningQuiz",
    xp: 80,
  }
]; 