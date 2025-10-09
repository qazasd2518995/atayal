import { DayData } from './week1';

// 第2週｜生活主題單字學習：詞彙分類建構
export const week2: DayData[] = [
  {
    day: 1,
    title: "家庭成員詞彙",
    content: [
      { type: "text", value: "學習泰雅語家庭成員的稱謂" },
      { type: "text", value: "爸爸 yaba'" },
      { type: "text", value: "媽媽 yaya'" },
      { type: "text", value: "男性長輩(祖父；外公；岳父) yutas" },
      { type: "text", value: "女性長輩(祖母；外婆；岳母) yaki'" },
      { type: "text", value: "兄長 qbsuyan" },
      { type: "text", value: "姊姊 qbsuyan kneril" },
      { type: "text", value: "哥哥 qbsuyan mlikuy" },
      { type: "text", value: "弟弟 sswe' mlikuy" },
      { type: "text", value: "妹妹 sswe' kneril" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「爸爸」的泰雅語是？",
        options: ["yaba'", "yaya'", "yutas"],
        answer: "yaba'",
        type: "single"
      },
      {
        id: "q2",
        question: "「姊姊」的泰雅語是？",
        options: ["qbsuyan kneril", "qbsuyan mlikuy", "sswe' kneril"],
        answer: "qbsuyan kneril",
        type: "single"
      }
    ],
    game: "WordImageMatch",
    xp: 70,
  },
  {
    day: 2,
    title: "身份與身體部位詞彙",
    content: [
      { type: "text", value: "學習身份詞彙" },
      { type: "text", value: "男孩 mlikuy、女孩 kneril、朋友 rangi'" },
      { type: "text", value: "孩童 'laqi'、老人家 bnkis、人 'Tayal" },
      { type: "text", value: "醫生 sinsiy pbetaq'、老師 sinsiy pcbaq biru'" },
      { type: "text", value: "學生 seto'、警察 kinsat" },
      { type: "text", value: "身體部位詞彙" },
      { type: "text", value: "耳朵 papak、眼睛 roziq、嘴巴 nqwaq" },
      { type: "text", value: "頭 tunux、手 qba'、腳 kakay" },
      { type: "text", value: "臉 rqyas、鼻子 nguhuw、身體 hi'" },
      { type: "text", value: "大腿 gaya'、指甲 kamit" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「醫生」的泰雅語是？",
        options: ["sinsiy pbetaq'", "sinsiy pcbaq biru'", "kinsat"],
        answer: "sinsiy pbetaq'",
        type: "single"
      },
      {
        id: "q2",
        question: "「眼睛」的泰雅語是？",
        options: ["papak", "roziq", "nqwaq"],
        answer: "roziq",
        type: "single"
      }
    ],
    game: "BodyPartQuiz",
    xp: 70,
  },
  {
    day: 3,
    title: "動物詞彙",
    content: [
      { type: "text", value: "學習各種動物的泰雅語名稱" },
      { type: "text", value: "豬 bzyok、狗 huzil、羊 mit" },
      { type: "text", value: "貓 ngyaw、鳥 qbhniq、魚 qulih" },
      { type: "text", value: "雞 ngta'、猴子 yungay、牛 kacing" },
      { type: "text", value: "老鼠(統稱) qoli'、青蛙 qpatung" },
      { type: "text", value: "貓頭鷹 nguzyaq" },
      { type: "text", value: "練習動物詞彙的發音，記住每種動物的特徵。" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「狗」的泰雅語是？",
        options: ["huzil", "bzyok", "mit"],
        answer: "huzil",
        type: "single"
      },
      {
        id: "q2",
        question: "「貓頭鷹」的泰雅語是？",
        options: ["nguzyaq", "qbhniq", "yungay"],
        answer: "nguzyaq",
        type: "single"
      }
    ],
    game: "AnimalSoundMatch",
    xp: 70,
  },
  {
    day: 4,
    title: "物品詞彙",
    content: [
      { type: "text", value: "學習日常用品的泰雅語名稱" },
      { type: "text", value: "書 biru'、錢 pila'、球 mari'" },
      { type: "text", value: "桌子 hanray、電話 kkyalan、筆 enpit" },
      { type: "text", value: "椅子 thekan、藥物 iyu'、電腦 tennaw" },
      { type: "text", value: "雨傘 ruku、手錶 toke'" },
      { type: "text", value: "這些都是日常生活中常見的物品，學會它們的泰雅語名稱很實用。" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「電腦」的泰雅語是？",
        options: ["tennaw", "kkyalan", "toke'"],
        answer: "tennaw",
        type: "single"
      },
      {
        id: "q2",
        question: "「桌子」的泰雅語是？",
        options: ["hanray", "thekan", "ruku"],
        answer: "hanray",
        type: "single"
      }
    ],
    game: "ObjectHunt",
    xp: 70,
  },
  {
    day: 5,
    title: "行動詞彙與基本自我介紹",
    content: [
      { type: "text", value: "學習動作相關的詞彙" },
      { type: "text", value: "關上 ql'i、打開 gmyah、去 mosa" },
      { type: "text", value: "賣 tbaziy、買 mbaziy、給 miq" },
      { type: "text", value: "(叫人)過來 uwah、來 muwah、借 ksyuw" },
      { type: "text", value: "走路 mhkani'、走(離開) shriq、飛 mlaka'" },
      { type: "text", value: "跑(祈使) qinah、抵達 mtta'" },
      { type: "text", value: "🔹 基本自我介紹與姓名" },
      { type: "text", value: "📘 主句型：" },
      { type: "text", value: "ima' qu isu' wah?（請自我介紹）" },
      { type: "text", value: "ima' lalu' su'?（你叫什麼名字）" },
      { type: "text", value: "___ lalu' mu.（我叫 ___）" },
      { type: "text", value: "💡 使用說明：" },
      { type: "text", value: "- ima'：什麼（疑問詞）" },
      { type: "text", value: "- lalu'：名字" },
      { type: "text", value: "- su'：你的" },
      { type: "text", value: "- mu：我的" },
      { type: "text", value: "📝 對話練習：" },
      { type: "text", value: "A: 「ima' lalu' su'？」（你叫什麼名字？）" },
      { type: "text", value: "B: 「Yumin lalu' mu」（我叫 Yumin）" },
      { type: "text", value: "第二週總複習：家庭、身份、身體部位、動物、物品、行動、自我介紹" },
      { type: "text", value: "恭喜完成生活主題單字學習！" },
    ],
    quiz: [
      {
        id: "q1",
        question: "「買」的泰雅語是？",
        options: ["mbaziy", "tbaziy", "ksyuw"],
        answer: "mbaziy",
        type: "single"
      },
      {
        id: "q2",
        question: "「你叫什麼名字？」的泰雅語是？",
        options: ["ima' lalu' su'?", "ima' kawas mu?", "ima' kinwagiq mu?"],
        answer: "ima' lalu' su'?",
        type: "single"
      },
      {
        id: "q3",
        question: "「我叫 Yumin」的泰雅語是？",
        options: ["Yumin lalu' mu", "Yumin kawas mu", "Yumin su'"],
        answer: "Yumin lalu' mu",
        type: "single"
      }
    ],
    game: "ActionSimon",
    xp: 90,
  }
]; 