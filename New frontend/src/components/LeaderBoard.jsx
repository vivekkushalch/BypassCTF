import React, { useState } from 'react';
// import { useGetDetailHook } from '../hooks/useGetDetailHook';

const mockData = Array.from({ length: 50 }, (_, i) => ({
  rank: i + 1,
  username: `user${i + 1}`,
  score: Math.floor(Math.random() * 1000),
}));

const Leaderboard = () => {


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
  <div className="w-full max-w-3xl mx-auto bg-white rounded-lg">
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>

      <div className="overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-3 font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-2">
          <span>Rank</span>
          <span className="text-center">Username</span>
          <span className="text-right">Score</span>
        </div>

        {/* Table Rows */}
        {currentData?.map((item,index) => (
          <div
            key={index}
            className="grid grid-cols-3 py-2 border-b border-gray-100 text-sm sm:text-base"
          >
            <span>{item.rank}</span>
            <span className="text-center">{item.username}</span>
            <span className="text-right font-medium">{item.score}</span>
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
    </div>
  </div>
);

};

export default Leaderboard;
