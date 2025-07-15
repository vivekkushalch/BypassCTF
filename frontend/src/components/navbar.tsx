"use client";

import React, { useState, useEffect } from "react";

interface NavbarProps {
  rank?: number;
}

const Navbar: React.FC<NavbarProps> = ({ rank = 1 }) => {
  const [displayRank, setDisplayRank] = useState(rank);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<
    "increase" | "decrease" | null
  >(null);

  useEffect(() => {
    if (rank !== displayRank) {
      setIsAnimating(true);
      setAnimationType(rank > displayRank ? "increase" : "decrease");

      // Animate the rank change
      const timer = setTimeout(() => {
        setDisplayRank(rank);
        setTimeout(() => {
          setIsAnimating(false);
          setAnimationType(null);
        }, 300);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [rank, displayRank]);

  return (
    <nav className="w-full bg-white border-b-2 border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center">
          <div className="relative">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-300 ${
                isAnimating
                  ? animationType === "increase"
                    ? "bg-green-100 text-green-700 scale-110 shadow-lg"
                    : "bg-red-100 text-red-700 scale-90"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              <span className="text-sm sm:text-base md:text-lg font-medium">
                Your rank is{" "}
              </span>
              <span
                className={`ml-2 text-xl sm:text-2xl font-bold transition-all duration-300 ${
                  isAnimating
                    ? animationType === "increase"
                      ? "transform scale-125 text-green-600"
                      : "transform scale-75 text-red-600"
                    : "text-blue-600"
                }`}
              >
                {displayRank}
              </span>

              {/* Animation indicators */}
              {isAnimating && (
                <div className="ml-2 flex items-center">
                  {animationType === "increase" ? (
                    <svg
                      className="w-5 h-5 text-green-500 animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-red-500 animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  )}
                </div>
              )}
            </div>

            {/* Celebration particles for rank increase */}
            {isAnimating && animationType === "increase" && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                <div
                  className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="absolute bottom-0 left-0 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="absolute bottom-0 right-0 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75"
                  style={{ animationDelay: "0.3s" }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
