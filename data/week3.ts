import { DayData } from './week1';

// 第3週｜神話與歷史文本：文化導讀與閱讀任務
export const week3: DayData[] = [
  {
    day: 1,
    title: "洪水神話故事（上）與年齡表達",
    content: [
      { type: "text", value: "📘 洪水與祭神 - 故事開始" },
      { type: "text", value: "📖 故事片段 1" },
      { type: "text", value: "Kmayal raral qu Tayal, maki qutux ryax si tbah mnku qu kayal ru mqwalax yaba balay2 na qwalx, baqaw ta squliq babaw cinbwanan qani ga m'ub." },
      { type: "text", value: "在太古時代，天色忽然暗了下來，之後就下個不停，約下了一百天。" },
      { type: "text", value: "📌 重要詞彙：Kmayal → 「很久以前」、squliq → 「雨」" },
      { type: "text", value: "📖 故事片段 2" },
      { type: "text", value: "Ktan mga, siy p'ubuy mqwalax kbhu ryax. ps'unan qsya kwara qu babaw hiyal. msunu laru, cingay balay squliq mhuqil." },
      { type: "text", value: "據說大雨下了一百天後，洪水泛濫，大地水滿漲山高。" },
      { type: "text", value: "📌 重要詞彙：mqwalax → 「下雨」、mhuqil → 「滿了」" },
      { type: "text", value: "🔹 年齡與族群身分" },
      { type: "text", value: "📘 主句型：" },
      { type: "text", value: "mopuw kawas maku' ___（我 ___ 歲）" },
      { type: "text", value: "'tayal su' inu' wah?（你是哪一族的小孩？）" },
      { type: "text", value: "'laqi' saku' na 'Tayal（我是泰雅族的小孩）" },
      { type: "text", value: "💡 數字詞彙：" },
      { type: "text", value: "- ten：十" },
      { type: "text", value: "- spat：四" },
      { type: "text", value: "- mopuw spat kawas：十四歲" },
    ],
    quiz: [
      {
        id: "q1",
        question: "\"squliq\" 是什麼意思？",
        options: ["山", "雨", "神"],
        answer: "雨",
        type: "single"
      },
      {
        id: "q2",
        question: "「我是泰雅族的小孩」的泰雅語是？",
        options: ["'laqi' saku' na 'Tayal", "'laqi' su' na 'Tayal", "'Tayal saku' na 'laqi'"],
        answer: "'laqi' saku' na 'Tayal",
        type: "single"
      }
    ],
    game: "StorySequence",
    xp: 90,
  },
  {
    day: 2,
    title: "洪水神話故事（中）",
    content: [
      { type: "text", value: "📖 故事片段 3" },
      { type: "text", value: "Tnaqun kmal na Utux qu Tayal. mkura squ wagiq bu rgyax Papak waga. ru mqyanux qa lhga hiya." },
      { type: "text", value: "天神特別指示一群泰雅族人爬上大霸尖山頂，因而保住了他們的生命。" },
      { type: "text", value: "📌 重要詞彙：Utux → 「神」、rgyax → 「山」" },
      { type: "text", value: "📖 故事片段 4" },
      { type: "text", value: "Tayal hiya ga. pgalu Utux klahang squ llagi nha, magal qutux blsuy kacin sqes nha Utux. ana ga ini gali na Utux." },
      { type: "text", value: "泰雅人開始生存下來。為了祈求神靈保護他們及後代子孫，族人設立祭壇祭神，但神不接受。" },
      { type: "text", value: "📌 重要詞彙：klahang → 「祭壇」、blsuy → 「祭祀」" },
    ],
    quiz: [
      {
        id: "q1",
        question: "神讓泰雅人做了什麼？",
        options: ["潛水", "爬山", "種田"],
        answer: "爬山",
        type: "single"
      },
      {
        id: "q2",
        question: "神接受了第一次祭品嗎？",
        options: ["有", "沒有", "不知道"],
        answer: "沒有",
        type: "single"
      }
    ],
    game: "StoryChoice",
    xp: 90,
  },
  {
    day: 3,
    title: "洪水神話故事（下）與家人對話",
    content: [
      { type: "text", value: "📖 故事片段 5" },
      { type: "text", value: "Ana ga hnyal pbnahu tora na qsya' lojiy qu squliq qasa. Mkayal qu phgu ki bnkis ru." },
      { type: "text", value: "神不滿意後，族人又祭了一位勇敢的戰士，結果也被退回。" },
      { type: "text", value: "📌 重要詞彙：b'nkis → 「勇士」、pbnahu → 「送去」" },
      { type: "text", value: "📖 故事片段 6" },
      { type: "text", value: "Gmwaya qutux betunu ru blaq na mkraki laqi na mrhuw na Tayal. sgabil n'ha Utux lga." },
      { type: "text", value: "最後，他們選了一位最美麗的女孩（族長的女兒）獻祭給神。" },
      { type: "text", value: "📌 重要詞彙：mkraki → 「漂亮的」、laqi → 「女孩」" },
      { type: "text", value: "🔹 我的家人是..." },
      { type: "text", value: "📘 主句型：" },
      { type: "text", value: "'tayal kwara' qu ngasal mamu?（你的家人都是原住民嗎？）" },
      { type: "text", value: "'Tayal kwara' sami qutux ngasal（我們全家都是泰雅族）" },
      { type: "text", value: "iyat, yaba' maku' ga 'Tayal, yaya' maku' ga plmukan（不是，我爸是泰雅族，我媽是漢人）" },
      { type: "text", value: "💡 重要詞彙：" },
      { type: "text", value: "- kwara'：都、全部" },
      { type: "text", value: "- ngasal：家人" },
      { type: "text", value: "- iyat：不是" },
      { type: "text", value: "- plmukan：漢人" },
    ],
    quiz: [
      {
        id: "q1",
        question: "神最後接受了誰的祭品？",
        options: ["男孩", "女孩", "公牛"],
        answer: "女孩",
        type: "single"
      },
      {
        id: "q2",
        question: "「不是」的泰雅語是？",
        options: ["iyat", "uwal", "ini"],
        answer: "iyat",
        type: "single"
      }
    ],
    game: "SentenceBuilder",
    xp: 90,
  },
  {
    day: 4,
    title: "洪水神話故事（結局）與家人疑問句",
    content: [
      { type: "text", value: "📖 故事片段 7" },
      { type: "text", value: "Si ktay \"syuw\" mha hngiyang. wal qzitun qsya qu mkrakis qasa lga." },
      { type: "text", value: "據說當女孩被祭獻後，天上出現咻咻的聲響，洪水與浪潮退去了。" },
      { type: "text", value: "📌 重要詞彙：hngiyang → 「聲音」、qzitun → 「退去」" },
      { type: "text", value: "這個神話故事告訴我們泰雅族對自然災害的理解和對神靈的敬畏。" },
      { type: "text", value: "故事中展現了族人團結互助、犧牲奉獻的精神。" },
      { type: "text", value: "🔹 誰是我的家人？" },
      { type: "text", value: "📘 主句型：" },
      { type: "text", value: "'laqi' su' ni ima?（你是誰的小孩？）" },
      { type: "text", value: "'laqi' saku' ni Silan Nawi（我是 Silan Nawi 的小孩）" },
      { type: "text", value: "qasa ga yaba' su'?（那位是你爸爸嗎？）" },
      { type: "text", value: "💡 疑問詞彙：" },
      { type: "text", value: "- ni ima：誰的" },
      { type: "text", value: "- qasa：那位、那個" },
      { type: "text", value: "- yaba'：爸爸" },
      { type: "text", value: "- yaya'：媽媽" },
    ],
    quiz: [
      {
        id: "q1",
        question: "當女孩被祭獻後發生了什麼？",
        options: ["洪水更大", "洪水退去", "又開始下雨"],
        answer: "洪水退去",
        type: "single"
      },
      {
        id: "q2",
        question: "「你是誰的小孩？」的泰雅語是？",
        options: ["'laqi' su' ni ima?", "'laqi' ima su'?", "ni ima 'laqi' su'?"],
        answer: "'laqi' su' ni ima?",
        type: "single"
      }
    ],
    game: "ConversationMatch",
    xp: 90,
  },
  {
    day: 5,
    title: "神話故事總複習與自我介紹完整對話",
    content: [
      { type: "text", value: "第三週總複習：洪水與祭神神話故事" },
      { type: "text", value: "📚 故事大綱回顧：" },
      { type: "text", value: "1. 太古時代連續下雨一百天" },
      { type: "text", value: "2. 神指示族人爬上大霸尖山避難" },
      { type: "text", value: "3. 族人設立祭壇但神不接受" },
      { type: "text", value: "4. 祭獻勇士仍被拒絕" },
      { type: "text", value: "5. 最後祭獻美麗女孩，洪水退去" },
      { type: "text", value: "🔤 重要詞彙複習：" },
      { type: "text", value: "Kmayal(很久以前)、squliq(雨)、Utux(神)、rgyax(山)、klahang(祭壇)、laqi(女孩)" },
      { type: "text", value: "🔹 年紀、身高與自我介紹總複習" },
      { type: "text", value: "📘 主句型：" },
      { type: "text", value: "👧 A: Pira' kawas mu?（你幾歲？）" },
      { type: "text", value: "🧒 B: Mopuw spat kawas maku'.（我十八歲。）" },
      { type: "text", value: "👧 A: Ktwa' kinwagiq mu?（你多高？）" },
      { type: "text", value: "🧒 B: Kbhul ru mspatul inci.（我一百四十公分。）" },
      { type: "text", value: "💡 身高詞彙：" },
      { type: "text", value: "- kinwagiq：身高" },
      { type: "text", value: "- kbhul：一百" },
      { type: "text", value: "- mspatul：四十" },
      { type: "text", value: "- inci：公分" },
      { type: "text", value: "🎯 總複習：從神話故事到實用對話，恭喜完成三週學習！您已經能夠進行基本的泰雅語自我介紹了。" },
    ],
    quiz: [
      {
        id: "q1",
        question: "\"Utux\" 是什麼意思？",
        options: ["神", "人", "山"],
        answer: "神",
        type: "single"
      },
      {
        id: "q2",
        question: "「我一百四十公分」的泰雅語是？",
        options: ["Kbhul ru mspatul inci.", "Mspatul kbhul inci.", "Kbhul mspatul."],
        answer: "Kbhul ru mspatul inci.",
        type: "single"
      },
      {
        id: "q3",
        question: "「你多高？」的泰雅語是？",
        options: ["Ktwa' kinwagiq mu?", "Pira' kinwagiq mu?", "Ima' kinwagiq mu?"],
        answer: "Ktwa' kinwagiq mu?",
        type: "single"
      }
    ],
    game: "CulturalTrivia",
    xp: 110,
  }
]; 