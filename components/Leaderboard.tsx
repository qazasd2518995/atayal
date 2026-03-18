'use client';

import { useEffect, useState } from 'react';
import { TrophyIcon, StarIcon, FireIcon } from '@heroicons/react/24/solid';

interface LeaderboardEntry {
  userName: string;
  level: number;
  totalXP: number;
  currentWeek: number;
  currentDay: number;
  completedCourses: number;
}

interface LeaderboardProps {
  currentUserName?: string | null;
}

export default function Leaderboard({ currentUserName }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
    // 每 30 秒刷新一次排行榜
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setLeaderboard(data.leaderboard || []);
      }
    } catch (err) {
      console.error('載入排行榜失敗:', err);
      setError('無法載入排行榜');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card-natural p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrophyIcon className="w-6 h-6 text-gold-500" />
          <h2 className="font-serif text-2xl font-bold text-stone-800">等級排行榜</h2>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-stone-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-natural p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrophyIcon className="w-6 h-6 text-gold-500" />
          <h2 className="font-serif text-2xl font-bold text-stone-800">等級排行榜</h2>
        </div>
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="card-natural p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrophyIcon className="w-6 h-6 text-gold-500" />
          <h2 className="font-serif text-2xl font-bold text-stone-800">等級排行榜</h2>
        </div>
        <p className="text-stone-500 text-center py-8">
          還沒有學生完成課程，快來成為第一名！
        </p>
      </div>
    );
  }

  const getRankStyle = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return 'bg-forest-50 border-2 border-forest-500 shadow-md';
    }
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-300 shadow-md';
      case 2:
        return 'bg-gradient-to-r from-stone-50 via-gray-50 to-stone-50 border-2 border-stone-300 shadow-sm';
      case 3:
        return 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-wood-300 shadow-sm';
      default:
        return 'bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm';
    }
  };

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
            <TrophyIcon className="w-5 h-5 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-300 to-stone-400 flex items-center justify-center shadow-sm">
            <TrophyIcon className="w-5 h-5 text-white" />
          </div>
        );
      case 3:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-wood-600 flex items-center justify-center shadow-sm">
            <TrophyIcon className="w-5 h-5 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
            <span className="font-bold text-sm text-forest-700">{rank}</span>
          </div>
        );
    }
  };

  return (
    <div className="card-natural p-6">
      {/* 標題 */}
      <div className="flex items-center gap-2 mb-5">
        <TrophyIcon className="w-6 h-6 text-gold-500" />
        <h2 className="font-serif text-2xl font-bold text-stone-800">等級排行榜</h2>
        <span className="ml-auto text-sm text-stone-500 font-medium">
          共 {leaderboard.length} 位學生
        </span>
      </div>

      {/* 排行列表 */}
      <div className="space-y-2.5">
        {leaderboard.slice(0, 10).map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.userName === currentUserName;

          return (
            <div
              key={`${entry.userName}-${rank}`}
              className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 ${getRankStyle(rank, isCurrentUser)}`}
            >
              {/* 排名 */}
              <div className="flex-shrink-0">
                {getRankDisplay(rank)}
              </div>

              {/* 用戶資訊 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-semibold truncate ${
                      isCurrentUser ? 'text-forest-700' : rank <= 3 ? 'text-stone-800' : 'text-stone-700'
                    }`}
                  >
                    {entry.userName}
                  </h3>
                  {isCurrentUser && (
                    <span className="text-xs bg-forest-600 text-white px-2 py-0.5 rounded-full font-medium">
                      你
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs mt-1">
                  <span className="flex items-center gap-1 text-stone-600 font-medium">
                    <StarIcon className="w-3.5 h-3.5 text-gold-500" />
                    等級 {entry.level}
                  </span>
                  <span className="flex items-center gap-1 text-stone-600 font-medium">
                    <FireIcon className="w-3.5 h-3.5 text-orange-500" />
                    {entry.totalXP} XP
                  </span>
                  <span className="text-stone-500 hidden sm:inline">
                    第 {entry.currentWeek} 週 / 第 {entry.currentDay} 天
                  </span>
                </div>
              </div>

              {/* 完成課程數 */}
              <div className="flex-shrink-0 text-right">
                <div className={`text-lg font-bold ${rank <= 3 ? 'text-forest-600' : 'text-forest-500'}`}>
                  {entry.completedCourses}
                </div>
                <div className="text-xs text-stone-500 font-medium">已完成</div>
              </div>
            </div>
          );
        })}
      </div>

      {leaderboard.length > 10 && (
        <div className="mt-5 text-center text-sm text-stone-500">
          顯示前 10 名 · 總共 {leaderboard.length} 位學生
        </div>
      )}
    </div>
  );
}
