import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GameLeaderboard = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // API functions
  const fetchLeaderboard = async () => {
    const response = await axios.get(`${BACKEND_URL}/leaderboard`);
    return response.data;
  };

  const fetchUserStats = async () => {
    const response = await axios.get(`${BACKEND_URL}/user/stats`);
    return response.data;
  };

  // TanStack Query hooks
  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const {
    data: userStats,
    isLoading: isUserStatsLoading,
    error: userStatsError,
  } = useQuery({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Don't fail the whole component if user stats fail
    throwOnError: false,
  });

  // Derived state
  const leaderboard = leaderboardData?.leaderboard || [];
  const lastUpdated = leaderboardData?.last_updated;
  const isLoading = isLeaderboardLoading;
  const error = leaderboardError;

  // Pagination logic
  const totalPages = Math.ceil(leaderboard.length / itemsPerPage);
  const currentData = leaderboard.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full bg-transparent text-yellow-400 font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent animate-spin mx-auto"></div>
          <div className="text-yellow-400 uppercase tracking-wider">
            &gt; LOADING LEADERBOARD...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full bg-transparent text-yellow-400 font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-400 uppercase tracking-wider">
            &gt; ERROR: {error.message || "Failed to load leaderboard"}
          </div>
          <button
            onClick={() => refetchLeaderboard()}
            className="px-4 py-2 border border-yellow-400 bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/40 transition-all duration-300 uppercase tracking-wider"
          >
            &gt; RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-transparent text-yellow-400 font-mono">
      <div className="flex flex-col h-full">
        {/* User's Personal Rank Section */}
        {userStats && !userStatsError && (
          <div className="mb-6 p-4 border-2 border-cyan-400 bg-cyan-900/10 rounded-lg">
            <div className="text-center mb-4">
              <div className="text-lg font-bold text-cyan-400 uppercase tracking-wider">
                &gt; YOUR RANK &lt;
                {isUserStatsLoading && (
                  <span className="ml-2 text-xs text-cyan-400/70">
                    UPDATING...
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-xs text-cyan-400/70 uppercase tracking-wider">
                  Rank
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  #{userStats.rank}
                </div>
                {userStats.total_users && (
                  <div className="text-xs text-cyan-400/70">
                    of {userStats.total_users}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xs text-cyan-400/70 uppercase tracking-wider">
                  Score
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {userStats.total_score?.toFixed(1) || "0.0"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-cyan-400/70 uppercase tracking-wider">
                  Level
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {userStats.current_level || 0}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-cyan-400/70 uppercase tracking-wider">
                  Progress
                </div>
                <div className="text-sm font-bold text-purple-400">
                  {userStats.passed_levels?.length || 0}P /{" "}
                  {userStats.failed_levels?.length || 0}F
                </div>
                <div className="text-xs text-cyan-400/70">Passed/Failed</div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <div className="text-sm text-cyan-300 uppercase tracking-wider truncate">
                {userStats.user_id}
              </div>
            </div>
          </div>
        )}

        {/* Data Status Indicators */}
        <div className="flex justify-between items-center mb-4">
          {/* Last Updated Info */}
          {lastUpdated && (
            <div className="text-xs text-yellow-400/70 uppercase tracking-wider">
              &gt; LAST UPDATED: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          )}

          {/* Loading indicator for background refreshes */}
          {(isLeaderboardLoading || isUserStatsLoading) && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border border-yellow-400 border-t-transparent animate-spin"></div>
              <span className="text-xs text-yellow-400/70 uppercase tracking-wider">
                REFRESHING...
              </span>
            </div>
          )}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 font-bold text-yellow-400 border-b border-yellow-400/50 pb-3 mb-4 uppercase tracking-wider text-sm">
          <span>RANK</span>
          <span className="text-center">USER</span>
          <span className="text-center">LEVEL</span>
          <span className="text-right">SCORE</span>
        </div>

        {/* Table Rows */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {currentData.length > 0 ? (
            currentData.map((item, index) => {
              const isCurrentUser =
                userStats && item.user_id === userStats.user_id;
              return (
                <div
                  key={item.user_id || index}
                  className={`grid grid-cols-4 py-3 border px-3 transition-all duration-300 ${
                    isCurrentUser
                      ? "border-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/30"
                      : "border-yellow-400/30 bg-yellow-900/10 hover:bg-yellow-900/20"
                  }`}
                >
                  <span
                    className={`font-bold ${
                      isCurrentUser ? "text-cyan-400" : "text-yellow-400"
                    }`}
                  >
                    #{item.rank}
                  </span>
                  <span
                    className={`text-center uppercase tracking-wider text-sm truncate ${
                      isCurrentUser ? "text-cyan-300" : "text-yellow-300"
                    }`}
                  >
                    {item.user_id}
                    {isCurrentUser && (
                      <span className="ml-1 text-cyan-400">(YOU)</span>
                    )}
                  </span>
                  <span className="text-center text-cyan-400 font-bold">
                    {item.current_level || 0}
                  </span>
                  <span
                    className={`text-right font-bold ${
                      isCurrentUser ? "text-cyan-400" : "text-yellow-400"
                    }`}
                  >
                    {item.score?.toFixed(1) || "0.0"}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-yellow-400/70 uppercase tracking-wider">
                &gt; NO DATA AVAILABLE
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2 flex-wrap border-t border-yellow-400/50 pt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-yellow-400 bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/40 text-xs font-mono uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              &lt; PREV
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum =
                currentPage <= 3
                  ? i + 1
                  : currentPage >= totalPages - 2
                  ? totalPages - 4 + i
                  : currentPage - 2 + i;

              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                      currentPage === pageNum
                        ? "bg-yellow-400 text-black border border-yellow-400 font-bold"
                        : "bg-yellow-900/20 text-yellow-400 border border-yellow-400 hover:bg-yellow-900/40"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-yellow-400 bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/40 text-xs font-mono uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              NEXT &gt;
            </button>
          </div>
        )}

        {/* Stats Footer */}
        <div className="text-xs text-yellow-400/70 mt-4 text-center uppercase tracking-wider">
          &gt; SHOWING {currentData.length} OF {leaderboard.length} HACKERS
        </div>
      </div>
    </div>
  );
};

export default GameLeaderboard;
