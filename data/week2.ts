import { DayData } from './week1';

// TODO: 之後請手動貼入完整教材與音檔路徑
export const week2: DayData[] = [
  {
    day: 1,
    title: "子音 p/b",
    content: [
      { type: "text", value: "學習泰雅語子音 p 和 b 的發音差異。" },
      { type: "audio", src: "/audio/week2/p_b.mp3" },
      { type: "text", value: "常見單字：pila (幾個)、balay (房子)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「房子」的泰雅語是？",
        options: ["balay", "palay", "baway"],
        answer: "balay",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 60,
  },
  {
    day: 2,
    title: "子音 t/d",
    content: [
      { type: "text", value: "學習泰雅語子音 t 和 d 的發音。" },
      { type: "audio", src: "/audio/week2/t_d.mp3" },
      { type: "text", value: "常見單字：tama (父親)、dayal (母親)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「父親」的泰雅語是？",
        options: ["tama", "dama", "taya"],
        answer: "tama",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 60,
  },
  {
    day: 3,
    title: "子音 k/g",
    content: [
      { type: "text", value: "學習泰雅語子音 k 和 g 的發音。" },
      { type: "audio", src: "/audio/week2/k_g.mp3" },
      { type: "text", value: "常見單字：kmal (真的)、gaga (部落)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「部落」的泰雅語是？",
        options: ["gaga", "kaga", "gaba"],
        answer: "gaga",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 60,
  },
  {
    day: 4,
    title: "子音 m/n",
    content: [
      { type: "text", value: "學習泰雅語鼻音 m 和 n 的發音。" },
      { type: "audio", src: "/audio/week2/m_n.mp3" },
      { type: "text", value: "常見單字：masu (你)、nanu (什麼)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「你」的泰雅語是？",
        options: ["masu", "nasu", "masa"],
        answer: "masu",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 60,
  },
  {
    day: 5,
    title: "子音 s/z",
    content: [
      { type: "text", value: "學習泰雅語子音 s 和 z 的發音。" },
      { type: "audio", src: "/audio/week2/s_z.mp3" },
      { type: "text", value: "常見單字：saku (我)、zimu (你們)" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「我」的泰雅語是？",
        options: ["saku", "zaku", "sasu"],
        answer: "saku",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 60,
  },
  {
    day: 6,
    title: "複習子音",
    content: [
      { type: "text", value: "複習本週學習的子音：p/b, t/d, k/g, m/n, s/z" },
      { type: "audio", src: "/audio/week2/consonants_review.mp3" },
      { type: "text", value: "練習辨認子音的發音差異。" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「真的」的泰雅語是？",
        options: ["kmal", "gmal", "kbal"],
        answer: "kmal",
        type: "single"
      },
      {
        id: "q2",
        question: "「什麼」的泰雅語是？",
        options: ["manu", "nanu", "sanu"],
        answer: "nanu",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 80,
  },
  {
    day: 7,
    title: "子音總測驗",
    content: [
      { type: "text", value: "第二週總測驗：測試您對泰雅語子音的掌握程度。" },
      { type: "text", value: "完成測驗後即可解鎖第三週課程！" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「父親」的正確泰雅語是？",
        options: ["tama", "dama", "kama"],
        answer: "tama",
        type: "single"
      },
      {
        id: "q2",
        question: "「部落」的泰雅語是？",
        options: ["gaga", "kaga", "baga"],
        answer: "gaga",
        type: "single"
      },
      {
        id: "q3",
        question: "「你們」的泰雅語是？",
        options: ["simu", "zimu", "timu"],
        answer: "zimu",
        type: "single"
      }
    ],
    game: "PictureChoice",
    xp: 120,
  }
]; 