import React, { useState } from "react";
// import { useGetDetailHook } from '../hooks/useGetDetailHook';

const mockData = Array.from({ length: 50 }, (_, i) => ({
  rank: i + 1,
  username: `user${i + 1}`,
  score: Math.floor(Math.random() * 1000),
}));

const GameLeaderboard = () => {
  // const {data, isLoading} = useGetDetailHook()

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  const currentData = mockData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full h-full bg-transparent text-yellow-400 font-mono">
      <div className="flex flex-col h-full">
        {/* Table Header */}
        <div className="grid grid-cols-3 font-bold text-yellow-400 border-b border-yellow-400/50 pb-3 mb-4 uppercase tracking-wider text-sm">
          <span>RANK</span>
          <span className="text-center">USER</span>
          <span className="text-right">SCORE</span>
        </div>

        {/* Table Rows */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {currentData?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 py-3 border border-yellow-400/30 bg-yellow-900/10 hover:bg-yellow-900/20 transition-all duration-300 px-3"
            >
              <span className="text-yellow-400 font-bold">#{item.rank}</span>
              <span className="text-center text-yellow-300 uppercase tracking-wider text-sm">
                {item.username}
              </span>
              <span className="text-right font-bold text-yellow-400">
                {item.score}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination */}
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
      </div>
    </div>
  );
};

export default GameLeaderboard;
