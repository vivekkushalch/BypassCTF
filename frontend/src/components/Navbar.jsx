import React, { useState, useEffect } from "react";
import WhiteLeaderboard from "./WhiteLeaderboard.jsx";

const Navbar = ({ username }) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // for animation trigger
  const randomRank = Math.floor(Math.random() * 100) + 1;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (showLeaderboard) {
      // trigger entrance animation after mount
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false); // prepare for next open
    }
  }, [showLeaderboard]);

  return (
    <>
      <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div className="w-full flex items-center justify-between sm:hidden">
          <div className="text-sm font-medium text-gray-800">
            {username} • Rank #{randomRank}
          </div>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow"
          >
            Leaderboard
          </button>
        </div>

        <div className="w-full hidden sm:flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800">{username}</div>
          <div className="text-lg font-medium text-gray-600">
            Rank #{randomRank}
          </div>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-md text-base font-semibold hover:bg-blue-700 transition-all duration-200 shadow"
          >
            Leaderboard
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {showLeaderboard && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setShowLeaderboard(false)}
          ></div>

          {isMobile ? (
            <div
              className={`fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-sm bg-white rounded-xl shadow-lg p-4 transition-all duration-300 ease-out ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <WhiteLeaderboard />
              <div className="text-center mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => setShowLeaderboard(false)}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            // Desktop Sidebar with smooth animation
            <div
              className={`fixed top-1/2 right-4 transform -translate-y-1/2 z-50 w-[400px] max-h-[95vh] bg-white shadow-xl rounded-lg p-5 flex flex-col transition-all duration-300 ease-out ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Leaderboard</h2>
                <button
                  className="text-red-500 font-medium hover:underline"
                  onClick={() => setShowLeaderboard(false)}
                >
                  Close
                </button>
              </div>
              <div className="flex-grow">
                <WhiteLeaderboard />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Navbar;
