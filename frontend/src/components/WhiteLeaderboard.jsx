import React, { useState } from "react";

const mockData = Array.from({ length: 50 }, (_, i) => ({
  rank: i + 1,
  username: `user${i + 1}`,
  score: Math.floor(Math.random() * 1000),
}));

const WhiteLeaderboard = () => {
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
    <div className="w-full h-full bg-white text-gray-800 font-sans">
      <div className="flex flex-col h-full">
        {/* Table Header */}
        <div className="grid grid-cols-3 font-bold text-gray-700 border-b border-gray-300 pb-3 mb-4 uppercase tracking-wider text-sm">
          <span>RANK</span>
          <span className="text-center">USER</span>
          <span className="text-right">SCORE</span>
        </div>

        {/* Table Rows */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {currentData?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 py-3 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-300 px-3 rounded"
            >
              <span className="text-blue-600 font-bold">#{item.rank}</span>
              <span className="text-center text-gray-700 uppercase tracking-wider text-sm">
                {item.username}
              </span>
              <span className="text-right font-bold text-gray-800">
                {item.score}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2 flex-wrap border-t border-gray-300 pt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-sans uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                  className={`px-3 py-1 text-xs font-sans uppercase tracking-wider transition-all duration-300 ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white border border-blue-600 font-bold"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
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
            className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-sans uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            NEXT &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhiteLeaderboard;
