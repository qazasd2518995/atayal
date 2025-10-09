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

  const getMedalIcon = (rank: number) => {
    if (rank === 1) {
      return <TrophyIcon className="w-6 h-6 text-yellow-400" />;
    } else if (rank === 2) {
      return <TrophyIcon className="w-6 h-6 text-gray-400" />;
    } else if (rank === 3) {
      return <TrophyIcon className="w-6 h-6 text-orange-400" />;
    }
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = [
        'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
        'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
        'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
      ];
      return colors[rank - 1];
    }
    return 'bg-blue-100 text-blue-700';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrophyIcon className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">等級排行榜</h2>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrophyIcon className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">等級排行榜</h2>
        </div>
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrophyIcon className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">等級排行榜</h2>
        </div>
        <p className="text-gray-500 text-center py-8">
          還沒有學生完成課程，快來成為第一名！
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrophyIcon className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-800">等級排行榜</h2>
        <span className="ml-auto text-sm text-gray-500">
          共 {leaderboard.length} 位學生
        </span>
      </div>

      <div className="space-y-2">
        {leaderboard.slice(0, 10).map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.userName === currentUserName;

          return (
            <div
              key={`${entry.userName}-${rank}`}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isCurrentUser
                  ? 'bg-blue-50 border-2 border-blue-400 shadow-md'
                  : rank <= 3
                  ? 'bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {/* 排名 */}
              <div className="flex items-center justify-center min-w-[3rem]">
                {getMedalIcon(rank) || (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankBadge(
                      rank
                    )}`}
                  >
                    {rank}
                  </div>
                )}
              </div>

              {/* 用戶資訊 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-semibold truncate ${
                      isCurrentUser ? 'text-blue-700' : 'text-gray-800'
                    }`}
                  >
                    {entry.userName}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                        你
                      </span>
                    )}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <StarIcon className="w-3 h-3 text-yellow-500" />
                    等級 {entry.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <FireIcon className="w-3 h-3 text-orange-500" />
                    {entry.totalXP} XP
                  </span>
                  <span className="text-gray-400">
                    第 {entry.currentWeek} 週 / 第 {entry.currentDay} 天
                  </span>
                </div>
              </div>

              {/* 完成課程數 */}
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {entry.completedCourses}
                </div>
                <div className="text-xs text-gray-500">已完成</div>
              </div>
            </div>
          );
        })}
      </div>

      {leaderboard.length > 10 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          顯示前 10 名 • 總共 {leaderboard.length} 位學生
        </div>
      )}
    </div>
  );
}
