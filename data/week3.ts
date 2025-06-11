import { DayData } from './week1';

// TODO: 之後請手動貼入完整教材與音檔路徑
export const week3: DayData[] = [
  {
    day: 1,
    title: "家族稱謂",
    content: [
      { type: "text", value: "學習泰雅語的家族稱謂詞彙。" },
      { type: "audio", src: "/audio/week3/family.mp3" },
      { type: "text", value: "家族詞彙：tama (父親)、dayal (母親)、wawa (小孩)、maki (兄弟姊妹)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「小孩」的泰雅語是？",
        options: ["wawa", "mama", "yaya"],
        answer: "wawa",
        type: "single"
      },
      {
        id: "q2",
        question: "「兄弟姊妹」的泰雅語是？",
        options: ["maki", "yaki", "taki"],
        answer: "maki",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 70,
  },
  {
    day: 2,
    title: "身體部位",
    content: [
      { type: "text", value: "學習泰雅語的身體部位詞彙。" },
      { type: "audio", src: "/audio/week3/body.mp3" },
      { type: "text", value: "身體詞彙：mata (眼睛)、ngalan (耳朵)、qara (手)、nuwak (腳)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「眼睛」的泰雅語是？",
        options: ["mata", "mada", "masa"],
        answer: "mata",
        type: "single"
      },
      {
        id: "q2",
        question: "「手」的泰雅語是？",
        options: ["qala", "qara", "gara"],
        answer: "qara",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 70,
  },
  {
    day: 3,
    title: "顏色詞彙",
    content: [
      { type: "text", value: "學習泰雅語的顏色詞彙。" },
      { type: "audio", src: "/audio/week3/colors.mp3" },
      { type: "text", value: "顏色詞彙：qasil (白色)、qomil (黑色)、libu (紅色)、lalu (綠色)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「白色」的泰雅語是？",
        options: ["qasil", "qosil", "gasil"],
        answer: "qasil",
        type: "single"
      },
      {
        id: "q2",
        question: "「紅色」的泰雅語是？",
        options: ["libu", "litu", "ribu"],
        answer: "libu",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 70,
  },
  {
    day: 4,
    title: "數字詞彙",
    content: [
      { type: "text", value: "學習泰雅語的數字詞彙。" },
      { type: "audio", src: "/audio/week3/numbers.mp3" },
      { type: "text", value: "數字詞彙：qutux (一)、sayun (二)、cyugal (三)、kayan (四)、magal (五)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「一」的泰雅語是？",
        options: ["qutux", "gutux", "kutux"],
        answer: "qutux",
        type: "single"
      },
      {
        id: "q2",
        question: "「三」的泰雅語是？",
        options: ["cyugal", "tyugal", "syugal"],
        answer: "cyugal",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 70,
  },
  {
    day: 5,
    title: "動物名稱",
    content: [
      { type: "text", value: "學習泰雅語的動物名稱詞彙。" },
      { type: "audio", src: "/audio/week3/animals.mp3" },
      { type: "text", value: "動物詞彙：huling (狗)、pusi (貓)、babuy (豬)、manuk (雞)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「狗」的泰雅語是？",
        options: ["huling", "hureng", "buling"],
        answer: "huling",
        type: "single"
      },
      {
        id: "q2",
        question: "「雞」的泰雅語是？",
        options: ["manuk", "nanuk", "kanuk"],
        answer: "manuk",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 70,
  },
  {
    day: 6,
    title: "詞彙複習",
    content: [
      { type: "text", value: "複習本週學習的各類詞彙：家族、身體、顏色、數字、動物。" },
      { type: "audio", src: "/audio/week3/vocabulary_review.mp3" },
      { type: "text", value: "練習記憶和正確發音各個詞彙。" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「耳朵」的泰雅語是？",
        options: ["ngalan", "ngaran", "ngalan"],
        answer: "ngalan",
        type: "single"
      },
      {
        id: "q2",
        question: "「二」的泰雅語是？",
        options: ["sayun", "sayul", "tayun"],
        answer: "sayun",
        type: "single"
      },
      {
        id: "q3",
        question: "「貓」的泰雅語是？",
        options: ["pusi", "busi", "musi"],
        answer: "pusi",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 90,
  },
  {
    day: 7,
    title: "詞彙總測驗",
    content: [
      { type: "text", value: "第三週總測驗：測試您對泰雅語詞彙的掌握程度。" },
      { type: "text", value: "完成測驗後即可解鎖第四週課程！" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「黑色」的正確泰雅語是？",
        options: ["qomil", "gomil", "komil"],
        answer: "qomil",
        type: "single"
      },
      {
        id: "q2",
        question: "「五」的泰雅語是？",
        options: ["magal", "nagal", "kagal"],
        answer: "magal",
        type: "single"
      },
      {
        id: "q3",
        question: "「腳」的泰雅語是？",
        options: ["nuwak", "nuwag", "ruwak"],
        answer: "nuwak",
        type: "single"
      },
      {
        id: "q4",
        question: "「豬」的泰雅語是？",
        options: ["babuy", "pabuy", "batuy"],
        answer: "babuy",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 140,
  }
]; 