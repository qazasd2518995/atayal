// 進度數據類型定義
export interface UserProgress {
  currentWeek: number;
  currentDay: number;
  completedDays: { [key: string]: boolean }; // "week-day" format
  totalXP: number;
  level: number;
}

// 獲取用戶進度
export function getUserProgress(): UserProgress {
  if (typeof window === 'undefined') {
    // 服務器端默認值
    return {
      currentWeek: 1,
      currentDay: 1,
      completedDays: {},
      totalXP: 0,
      level: 1,
    };
  }

  const stored = localStorage.getItem('tayal-progress');
  if (stored) {
    return JSON.parse(stored);
  }

  return {
    currentWeek: 1,
    currentDay: 1,
    completedDays: {},
    totalXP: 0,
    level: 1,
  };
}

// 保存用戶進度到 localStorage 和 DynamoDB
export async function saveUserProgress(progress: UserProgress): Promise<void> {
  if (typeof window !== 'undefined') {
    // 保存到 localStorage 作為本地緩存
    localStorage.setItem('tayal-progress', JSON.stringify(progress));

    // 同步到 DynamoDB
    const userName = localStorage.getItem('userName');
    if (userName) {
      await syncProgressToCloud(userName, progress);
    }
  }
}

// 同步進度到雲端 (DynamoDB)
async function syncProgressToCloud(userName: string, progress: UserProgress): Promise<void> {
  try {
    await fetch('/api/user/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, progress }),
    });
  } catch (error) {
    console.error('同步進度到雲端失敗:', error);
  }
}

// 從雲端載入進度
export async function loadProgressFromCloud(userName: string): Promise<UserProgress | null> {
  try {
    const response = await fetch(`/api/user/progress?userName=${encodeURIComponent(userName)}`);
    const data = await response.json();

    if (data.exists && data.progress) {
      return data.progress;
    }
    return null;
  } catch (error) {
    console.error('從雲端載入進度失敗:', error);
    return null;
  }
}

// 計算等級所需經驗值
export function getXPForLevel(level: number): number {
  return level * 100;
}

// 根據總經驗值計算等級
export function calculateLevel(totalXP: number): number {
  let level = 1;
  let requiredXP = getXPForLevel(level);
  
  while (totalXP >= requiredXP) {
    level++;
    requiredXP += getXPForLevel(level);
  }
  
  return level;
}

// 獲取當前等級進度
export function getLevelProgress(totalXP: number, level: number): { current: number; required: number; percentage: number } {
  let usedXP = 0;
  for (let i = 1; i < level; i++) {
    usedXP += getXPForLevel(i);
  }
  
  const currentLevelXP = totalXP - usedXP;
  const requiredForCurrentLevel = getXPForLevel(level);
  const percentage = Math.round((currentLevelXP / requiredForCurrentLevel) * 100);
  
  return {
    current: currentLevelXP,
    required: requiredForCurrentLevel,
    percentage: Math.min(percentage, 100)
  };
}

// 添加經驗值
export function addXP(xp: number): UserProgress {
  const progress = getUserProgress();
  progress.totalXP += xp;
  progress.level = calculateLevel(progress.totalXP);
  saveUserProgress(progress);
  return progress;
}

// 標記課程完成
export function markCompleted(week: number, day: number): UserProgress {
  const progress = getUserProgress();
  const key = `${week}-${day}`;
  progress.completedDays[key] = true;
  
  // 自動推進到下一天
  if (day < 5) {
    progress.currentDay = day + 1;
  } else if (week < 4) {
    progress.currentWeek = week + 1;
    progress.currentDay = 1;
  }
  
  saveUserProgress(progress);
  return progress;
}

// 檢查課程是否已完成
export function isCompleted(week: number, day: number): boolean {
  const progress = getUserProgress();
  const key = `${week}-${day}`;
  return progress.completedDays[key] || false;
}

// 檢查開發者模式
export function isDeveloperMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('tayal-developer-mode') === 'true';
}

// 檢查課程是否已解鎖
export function isUnlocked(week: number, day: number): boolean {
  // 開發者模式下所有課程都解鎖
  if (isDeveloperMode()) return true;
  
  const progress = getUserProgress();
  
  // 第一週第一天總是解鎖
  if (week === 1 && day === 1) return true;
  
  // 檢查是否已達到當前進度
  if (week < progress.currentWeek) return true;
  if (week === progress.currentWeek && day <= progress.currentDay) return true;
  
  return false;
}

// 重置進度（僅用於開發/測試）
export function resetProgress(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tayal-progress');
  }
} 