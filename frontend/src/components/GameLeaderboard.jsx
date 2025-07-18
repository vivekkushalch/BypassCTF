import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://bypass-crjv.onrender.com";

const GameLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/leaderboard`);
      const data = response.data;

      setLeaderboardData(data.leaderboard || []);
      setLastUpdated(data.last_updated);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setError("Failed to load leaderboard");
      // Fallback to mock data if API fails
      setLeaderboardData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  const currentData = leaderboardData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  if (error) {
    return (
      <div className="w-full h-full bg-transparent text-yellow-400 font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-400 uppercase tracking-wider">
            &gt; ERROR: {error}
          </div>
          <button
            onClick={fetchLeaderboard}
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
        {/* Last Updated Info */}
        {lastUpdated && (
          <div className="text-xs text-yellow-400/70 mb-4 uppercase tracking-wider">
            &gt; LAST UPDATED: {new Date(lastUpdated).toLocaleTimeString()}
          </div>
        )}

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
            currentData.map((item, index) => (
              <div
                key={item.user_id || index}
                className="grid grid-cols-4 py-3 border border-yellow-400/30 bg-yellow-900/10 hover:bg-yellow-900/20 transition-all duration-300 px-3"
              >
                <span className="text-yellow-400 font-bold">#{item.rank}</span>
                <span className="text-center text-yellow-300 uppercase tracking-wider text-sm truncate">
                  {item.user_id}
                </span>
                <span className="text-center text-cyan-400 font-bold">
                  {item.current_level || 0}
                </span>
                <span className="text-right font-bold text-yellow-400">
                  {item.score?.toFixed(1) || "0.0"}
                </span>
              </div>
            ))
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
          &gt; SHOWING {currentData.length} OF {leaderboardData.length} HACKERS
        </div>
      </div>
    </div>
  );
};

export default GameLeaderboard;
