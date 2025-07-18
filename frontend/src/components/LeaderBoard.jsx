import React, { useState } from 'react';
import { useGetDetailHook } from '../hooks/useGetDetailHook';
import { LoaderCircle } from 'lucide-react';

const Leaderboard = () => {
  const { data, isLoading } = useGetDetailHook();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
  const currentData = data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow p-4">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <LoaderCircle className="animate-spin h-8 w-8 text-gray-500" />
          </div>
        ) : (
          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-2">
              <span>Rank</span>
              <span className="text-center">Username</span>
              <span className="text-right">Score</span>
              <span className="text-right">Level</span>
            </div>

            {/* Table Rows */}
            {currentData?.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 py-2 border-b border-gray-100 text-sm sm:text-base"
              >
                <span>{item.rank}</span>
                <span className="text-center">{item.user_id}</span>
                <span className="text-right font-medium">{item.score}</span>
                <span className="text-right font-medium">{item.current_level}</span>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
