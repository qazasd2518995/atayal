// 課前/課後總測驗
export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  category: 'alphabet' | 'vocabulary' | 'grammar' | 'culture';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const comprehensiveAssessment: AssessmentQuestion[] = [
  // ===== 字母與發音 (Week 1) =====
  {
    id: "a1",
    question: "泰雅語總共有幾個母音？",
    options: ["3個", "5個", "7個"],
    answer: "5個",
    category: "alphabet",
    difficulty: "easy"
  },
  {
    id: "a2",
    question: "泰雅語總共有幾個子音？",
    options: ["17個", "19個", "21個"],
    answer: "19個",
    category: "alphabet",
    difficulty: "easy"
  },
  {
    id: "a3",
    question: "聲門塞音 ' 的發音特色是？",
    options: ["聲門突然閉合再打開", "舌尖輕彈", "氣流摩擦"],
    answer: "聲門突然閉合再打開",
    category: "alphabet",
    difficulty: "medium"
  },

  // ===== 基礎詞彙 (Week 1) =====
  {
    id: "v1",
    question: "「葉子」的泰雅語是？",
    options: ["abaw", "abay", "alaw"],
    answer: "abaw",
    category: "vocabulary",
    difficulty: "easy"
  },
  {
    id: "v2",
    question: "「三」的泰雅語是？",
    options: ["cyugal", "cyama", "cingal"],
    answer: "cyugal",
    category: "vocabulary",
    difficulty: "easy"
  },
  {
    id: "v3",
    question: "「電影」的泰雅語是？",
    options: ["ega", "eta", "ena"],
    answer: "ega",
    category: "vocabulary",
    difficulty: "easy"
  },
  {
    id: "v4",
    question: "「根」的泰雅語是？",
    options: ["gamil", "gasil", "gamal"],
    answer: "gamil",
    category: "vocabulary",
    difficulty: "easy"
  },
  {
    id: "v5",
    question: "「車子」的泰雅語是？",
    options: ["basu", "batu", "banu"],
    answer: "basu",
    category: "vocabulary",
    difficulty: "easy"
  },

  // ===== 家庭成員 (Week 2) =====
  {
    id: "v6",
    question: "「爸爸」的泰雅語是？",
    options: ["yaba'", "yaya'", "yutas"],
    answer: "yaba'",
    category: "vocabulary",
    difficulty: "easy"
  },
  {
    id: "v7",
    question: "「媽媽」的泰雅語是？",
    options: ["yaya'", "yaba'", "yaki'"],
    answer: "yaya'",
    category: "vocabulary",
    difficulty: "easy"
  },
  {
    id: "v8",
    question: "「姊姊」的泰雅語是？",
    options: ["qbsuyan kneril", "qbsuyan mlikuy", "sswe' kneril"],
    answer: "qbsuyan kneril",
    category: "vocabulary",
    difficulty: "medium"
  },

  // ===== 身體部位 (Week 2) =====
  {
    id: "v9",
    question: "「眼睛」的泰雅語是？",
    options: ["roziq", "papak", "nqwaq"],
    answer: "roziq",
    category: "vocabulary",
    difficulty: "medium"
  },
  {
    id: "v10",
    question: "「耳朵」的泰雅語是？",
    options: ["papak", "roziq", "nguhuw"],
    answer: "papak",
    category: "vocabulary",
    difficulty: "medium"
  },

  // ===== 動物 (Week 2) =====
  {
    id: "v11",
    question: "「狗」的泰雅語是？",
    options: ["huzil", "bzyok", "mit"],
    answer: "huzil",
    category: "vocabulary",
    difficulty: "easy"
  },
  {
    id: "v12",
    question: "「貓頭鷹」的泰雅語是？",
    options: ["nguzyaq", "qbhniq", "yungay"],
    answer: "nguzyaq",
    category: "vocabulary",
    difficulty: "hard"
  },

  // ===== 物品 (Week 2) =====
  {
    id: "v13",
    question: "「電腦」的泰雅語是？",
    options: ["tennaw", "kkyalan", "toke'"],
    answer: "tennaw",
    category: "vocabulary",
    difficulty: "medium"
  },
  {
    id: "v14",
    question: "「桌子」的泰雅語是？",
    options: ["hanray", "thekan", "ruku"],
    answer: "hanray",
    category: "vocabulary",
    difficulty: "medium"
  },

  // ===== 動作詞彙 (Week 2) =====
  {
    id: "v15",
    question: "「買」的泰雅語是？",
    options: ["mbaziy", "tbaziy", "ksyuw"],
    answer: "mbaziy",
    category: "vocabulary",
    difficulty: "medium"
  },

  // ===== 基本句型與自我介紹 (Week 2) =====
  {
    id: "g1",
    question: "「你叫什麼名字？」的泰雅語是？",
    options: ["ima' lalu' su'?", "ima' kawas mu?", "ima' kinwagiq mu?"],
    answer: "ima' lalu' su'?",
    category: "grammar",
    difficulty: "medium"
  },
  {
    id: "g2",
    question: "「我叫 Yumin」的泰雅語是？",
    options: ["Yumin lalu' mu", "Yumin kawas mu", "Yumin su'"],
    answer: "Yumin lalu' mu",
    category: "grammar",
    difficulty: "medium"
  },

  // ===== 神話故事詞彙 (Week 3) =====
  {
    id: "v16",
    question: "\"squliq\" 是什麼意思？",
    options: ["雨", "山", "神"],
    answer: "雨",
    category: "vocabulary",
    difficulty: "medium"
  },
  {
    id: "v17",
    question: "\"Utux\" 是什麼意思？",
    options: ["神", "人", "山"],
    answer: "神",
    category: "vocabulary",
    difficulty: "easy"
  },
  {
    id: "v18",
    question: "\"Kmayal\" 是什麼意思？",
    options: ["很久以前", "現在", "未來"],
    answer: "很久以前",
    category: "vocabulary",
    difficulty: "medium"
  },

  // ===== 年齡與身分 (Week 3) =====
  {
    id: "g3",
    question: "「我是泰雅族的小孩」的泰雅語是？",
    options: ["'laqi' saku' na 'Tayal", "'laqi' su' na 'Tayal", "'Tayal saku' na 'laqi'"],
    answer: "'laqi' saku' na 'Tayal",
    category: "grammar",
    difficulty: "medium"
  },
  {
    id: "g4",
    question: "「不是」的泰雅語是？",
    options: ["iyat", "uwal", "ini"],
    answer: "iyat",
    category: "grammar",
    difficulty: "medium"
  },

  // ===== 家人疑問句 (Week 3) =====
  {
    id: "g5",
    question: "「你是誰的小孩？」的泰雅語是？",
    options: ["'laqi' su' ni ima?", "'laqi' ima su'?", "ni ima 'laqi' su'?"],
    answer: "'laqi' su' ni ima?",
    category: "grammar",
    difficulty: "hard"
  },

  // ===== 身高與數字 (Week 3) =====
  {
    id: "g6",
    question: "「你多高？」的泰雅語是？",
    options: ["Ktwa' kinwagiq mu?", "Pira' kinwagiq mu?", "Ima' kinwagiq mu?"],
    answer: "Ktwa' kinwagiq mu?",
    category: "grammar",
    difficulty: "hard"
  },
  {
    id: "g7",
    question: "「我一百四十公分」的泰雅語是？",
    options: ["Kbhul ru mspatul inci.", "Mspatul kbhul inci.", "Kbhul mspatul."],
    answer: "Kbhul ru mspatul inci.",
    category: "grammar",
    difficulty: "hard"
  },

  // ===== 文化理解 (Week 3) =====
  {
    id: "c1",
    question: "洪水神話中，神讓泰雅人做了什麼？",
    options: ["爬山", "潛水", "種田"],
    answer: "爬山",
    category: "culture",
    difficulty: "easy"
  },
  {
    id: "c2",
    question: "神最後接受了誰的祭品？",
    options: ["美麗的女孩", "勇敢的戰士", "族長"],
    answer: "美麗的女孩",
    category: "culture",
    difficulty: "medium"
  },
  {
    id: "c3",
    question: "當女孩被祭獻後發生了什麼？",
    options: ["洪水退去", "洪水更大", "又開始下雨"],
    answer: "洪水退去",
    category: "culture",
    difficulty: "easy"
  },

  // ===== 綜合應用題 =====
  {
    id: "g8",
    question: "如果要說「我們全家都是泰雅族」，正確的泰雅語是？",
    options: ["'Tayal kwara' sami qutux ngasal", "'Tayal sami kwara' ngasal", "kwara' 'Tayal sami ngasal"],
    answer: "'Tayal kwara' sami qutux ngasal",
    category: "grammar",
    difficulty: "hard"
  }
];

// 測驗結果數據結構
export interface AssessmentResult {
  userName: string;
  assessmentType: 'pre' | 'post'; // 課前或課後
  score: number; // 分數
  totalQuestions: number; // 總題數
  correctAnswers: number; // 答對題數
  answers: { questionId: string; userAnswer: string; correct: boolean }[]; // 作答記錄
  completedAt: string; // 完成時間
  timeTaken: number; // 花費時間（秒）
}
