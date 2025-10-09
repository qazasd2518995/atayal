// 分析追蹤工具 - 客戶端使用

export interface SessionData {
  userName: string;
  sessionId: string;
  loginTime: string;
  logoutTime?: string;
  totalDuration?: number; // 總時長（分鐘）
}

export interface ActivityData {
  userName: string;
  sessionId: string;
  timestamp: string;
  activityType: 'learning' | 'quiz' | 'game' | 'pronunciation';
  duration: number; // 分鐘
  details?: any;
}

export interface QuizResult {
  userName: string;
  sessionId: string;
  timestamp: string;
  week: number;
  day: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // 秒
}

export interface GameResult {
  userName: string;
  sessionId: string;
  timestamp: string;
  week: number;
  day: number;
  gameType: string;
  score: number;
  attempts?: number;
  timeSpent: number; // 秒
}

export interface PronunciationPractice {
  userName: string;
  sessionId: string;
  timestamp: string;
  letter?: string;
  word?: string;
  score?: number;
  attempts: number;
}

export interface CourseCompletion {
  userName: string;
  sessionId: string;
  timestamp: string;
  week: number;
  day: number;
  xpEarned: number;
}

export interface ChatMessage {
  userName: string;
  sessionId: string;
  timestamp: string;
  userInput: string;
  llmOutput: string;
  llmSource: 'groq' | 'fallback';
}

// 生成唯一 session ID
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 獲取當前 session
export function getCurrentSession(): { userName: string; sessionId: string } | null {
  if (typeof window === 'undefined') return null;

  const userName = localStorage.getItem('userName');
  let sessionId = sessionStorage.getItem('sessionId');

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('sessionId', sessionId);
  }

  if (!userName) return null;

  return { userName, sessionId };
}

// 追蹤登入
export async function trackLogin(userName: string) {
  const sessionId = generateSessionId();
  sessionStorage.setItem('sessionId', sessionId);
  sessionStorage.setItem('loginTime', new Date().toISOString());

  const sessionData: SessionData = {
    userName,
    sessionId,
    loginTime: new Date().toISOString(),
  };

  try {
    await fetch('/api/analytics/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'login', data: sessionData }),
    });
  } catch (error) {
    console.error('Failed to track login:', error);
  }
}

// 追蹤登出
export async function trackLogout() {
  const session = getCurrentSession();
  if (!session) return;

  const loginTime = sessionStorage.getItem('loginTime') || new Date().toISOString();
  const logoutTime = new Date().toISOString();

  let totalDuration = 0;
  if (loginTime) {
    const duration = new Date(logoutTime).getTime() - new Date(loginTime).getTime();
    totalDuration = Math.round(duration / 1000 / 60); // 轉換為分鐘
  }

  const sessionData: SessionData = {
    ...session,
    loginTime,
    logoutTime,
    totalDuration,
  };

  try {
    await fetch('/api/analytics/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'logout', data: sessionData }),
    });
  } catch (error) {
    console.error('Failed to track logout:', error);
  }
}

// 追蹤活動時長
export async function trackActivity(activityType: ActivityData['activityType'], duration: number, details?: any) {
  const session = getCurrentSession();
  if (!session) return;

  const activityData: ActivityData = {
    ...session,
    timestamp: new Date().toISOString(),
    activityType,
    duration,
    details,
  };

  try {
    await fetch('/api/analytics/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData),
    });
  } catch (error) {
    console.error('Failed to track activity:', error);
  }
}

// 追蹤測驗成績
export async function trackQuizResult(result: Omit<QuizResult, 'userName' | 'sessionId' | 'timestamp'>) {
  const session = getCurrentSession();
  if (!session) return;

  const quizData: QuizResult = {
    ...session,
    timestamp: new Date().toISOString(),
    ...result,
  };

  try {
    await fetch('/api/analytics/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizData),
    });
  } catch (error) {
    console.error('Failed to track quiz result:', error);
  }
}

// 追蹤遊戲成績
export async function trackGameResult(result: Omit<GameResult, 'userName' | 'sessionId' | 'timestamp'>) {
  const session = getCurrentSession();
  if (!session) return;

  const gameData: GameResult = {
    ...session,
    timestamp: new Date().toISOString(),
    ...result,
  };

  try {
    await fetch('/api/analytics/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData),
    });
  } catch (error) {
    console.error('Failed to track game result:', error);
  }
}

// 追蹤發音練習
export async function trackPronunciation(practice: Omit<PronunciationPractice, 'userName' | 'sessionId' | 'timestamp'>) {
  const session = getCurrentSession();
  if (!session) return;

  const pronunciationData: PronunciationPractice = {
    ...session,
    timestamp: new Date().toISOString(),
    ...practice,
  };

  try {
    await fetch('/api/analytics/pronunciation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pronunciationData),
    });
  } catch (error) {
    console.error('Failed to track pronunciation:', error);
  }
}

// 追蹤課程完成
export async function trackCourseCompletion(completion: Omit<CourseCompletion, 'userName' | 'sessionId' | 'timestamp'>) {
  const session = getCurrentSession();
  if (!session) return;

  const completionData: CourseCompletion = {
    ...session,
    timestamp: new Date().toISOString(),
    ...completion,
  };

  try {
    await fetch('/api/analytics/completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completionData),
    });
  } catch (error) {
    console.error('Failed to track course completion:', error);
  }
}

// 計算登入次數
export function getLoginCount(): number {
  if (typeof window === 'undefined') return 0;
  const count = localStorage.getItem('loginCount');
  return count ? parseInt(count, 10) : 0;
}

export function incrementLoginCount() {
  if (typeof window === 'undefined') return;
  const count = getLoginCount() + 1;
  localStorage.setItem('loginCount', count.toString());
}

// 追蹤聊天對話
export async function trackChat(chat: Omit<ChatMessage, 'userName' | 'sessionId' | 'timestamp'>) {
  const session = getCurrentSession();
  if (!session) return;

  const chatData: ChatMessage = {
    ...session,
    timestamp: new Date().toISOString(),
    ...chat,
  };

  try {
    await fetch('/api/analytics/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatData),
    });
  } catch (error) {
    console.error('Failed to track chat:', error);
  }
}

// 活動計時器類別
export class ActivityTimer {
  private startTime: number;
  private activityType: ActivityData['activityType'];

  constructor(activityType: ActivityData['activityType']) {
    this.activityType = activityType;
    this.startTime = Date.now();
  }

  async stop(details?: any) {
    const duration = Math.round((Date.now() - this.startTime) / 1000 / 60); // 分鐘
    await trackActivity(this.activityType, duration, details);
  }
}
