"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  passwordLevels,
  initialGameState,
  GameState,
} from "@/data/passwordLevels";
import Leaderboard from "@/components/leaderboard";

export default function Home() {
  const [step, setStep] = useState<"question" | "username" | "password">(
    "question"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showQuestionAnimation, setShowQuestionAnimation] = useState(false);
  const [showLeaderboardPopup, setShowLeaderboardPopup] = useState(false);

  const handleBitQuestion = (answer: boolean) => {
    if (answer) {
      setShowQuestionAnimation(true);
      setTimeout(() => {
        setStep("username");
      }, 500);
    } else {
      alert("This is only for BIT students!");
    }
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setStep("password");
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);

    // Check all levels and update game state
    const newPassedLevels: number[] = [];
    const newFailedLevels: number[] = [];

    passwordLevels.forEach((levelData) => {
      const isValid = levelData.validator(newPassword);
      if (isValid) {
        newPassedLevels.push(levelData.level);
      } else {
        // Add to failed levels if it's at or below the highest reached level
        if (levelData.level <= gameState.currentLevel) {
          newFailedLevels.push(levelData.level);
        }
      }
    });

    // Find the current level (highest consecutive passed level + 1)
    let currentLevel = 1;
    for (let i = 1; i <= passwordLevels.length; i++) {
      if (newPassedLevels.includes(i)) {
        currentLevel = i + 1;
      } else {
        break;
      }
    }

    // Remember the highest level reached (never goes backward)
    const highestReached = Math.max(gameState.currentLevel, currentLevel);

    // If all levels are passed, we're complete
    const isComplete = newPassedLevels.length === passwordLevels.length;

    setGameState({
      currentLevel: highestReached,
      passedLevels: newPassedLevels,
      failedLevels: newFailedLevels,
      isComplete,
    });
  };

  const handlePasswordSubmit = () => {
    if (gameState.isComplete && password.trim()) {
      alert(
        `Congratulations ${username}! You've completed all password levels! 🎉`
      );
    }
  };

  const getDigitSum = (str: string) => {
    const digits = str.match(/\d/g);
    return digits ? digits.reduce((sum, digit) => sum + parseInt(digit), 0) : 0;
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Mobile Leaderboard Popup */}
      {showLeaderboardPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 lg:hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Leaderboard</h2>
              <button
                onClick={() => setShowLeaderboardPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <Leaderboard />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-8">
        {step === "question" && (
          <div
            className={`transition-all duration-500 ${
              showQuestionAnimation
                ? "opacity-0 scale-95"
                : "opacity-100 scale-100"
            }`}
          >
            <h1 className="text-4xl font-bold text-center mb-8">
              🔒 The Password Game
            </h1>
            <div className="text-center mb-8">
              <p className="text-xl mb-6">Are you from BIT?</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => handleBitQuestion(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => handleBitQuestion(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg"
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === "username" && (
          <div className="animate-fadeIn max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">
              🔒 The Password Game
            </h1>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Enter your username
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username..."
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === "Enter" && handleUsernameSubmit()}
                autoFocus
              />
              <Button
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-4 text-lg"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "password" && (
          <div className="animate-fadeIn">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Game Content */}
              <div className="flex-1 max-w-2xl">
                {/* Mobile Leaderboard Button */}
                <div className="lg:hidden mb-4">
                  <Button
                    onClick={() => setShowLeaderboardPopup(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm"
                  >
                    📊 View Leaderboard
                  </Button>
                </div>

                <h1 className="text-4xl font-bold text-center mb-4">
                  🔒 The Password Game
                </h1>
                <p className="text-center text-gray-600 mb-8">
                  Please choose a password
                </p>

                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="Enter your password..."
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {password.length} characters
                    </div>
                  </div>

                  {/* Display rules: Current (highest reached) -> Failed -> Passed */}
                  <div className="space-y-4">
                    {/* 1. Current Level First - Always show highest reached level */}
                    {gameState.currentLevel <= passwordLevels.length && (
                      <div
                        className={`border-2 rounded-lg p-4 transition-all duration-300 animate-slideIn ${
                          gameState.passedLevels.includes(
                            gameState.currentLevel
                          ) &&
                          !gameState.failedLevels.includes(
                            gameState.currentLevel
                          )
                            ? "border-green-500 bg-green-50"
                            : gameState.failedLevels.includes(
                                gameState.currentLevel
                              )
                            ? "border-red-500 bg-red-50"
                            : "border-blue-500 bg-blue-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                              gameState.passedLevels.includes(
                                gameState.currentLevel
                              ) &&
                              !gameState.failedLevels.includes(
                                gameState.currentLevel
                              )
                                ? "bg-green-500 text-white"
                                : gameState.failedLevels.includes(
                                    gameState.currentLevel
                                  )
                                ? "bg-red-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}
                          >
                            {gameState.passedLevels.includes(
                              gameState.currentLevel
                            ) &&
                            !gameState.failedLevels.includes(
                              gameState.currentLevel
                            )
                              ? "✓"
                              : gameState.currentLevel}
                          </div>
                          <div className="flex-1">
                            {(() => {
                              const currentLevelData = passwordLevels.find(
                                (l) => l.level === gameState.currentLevel
                              );
                              if (!currentLevelData) return null;

                              return (
                                <>
                                  <p
                                    className={`font-medium ${
                                      gameState.passedLevels.includes(
                                        gameState.currentLevel
                                      ) &&
                                      !gameState.failedLevels.includes(
                                        gameState.currentLevel
                                      )
                                        ? "text-green-700"
                                        : gameState.failedLevels.includes(
                                            gameState.currentLevel
                                          )
                                        ? "text-red-700"
                                        : "text-blue-700"
                                    }`}
                                  >
                                    Rule {gameState.currentLevel}:{" "}
                                    {currentLevelData.description}
                                  </p>

                                  {/* Level-specific extras */}
                                  {currentLevelData.extras?.map(
                                    (extra, index) => (
                                      <div
                                        key={index}
                                        className="mt-2 p-2 bg-white rounded text-sm text-gray-600 border"
                                      >
                                        <strong>{extra.title}:</strong>{" "}
                                        {extra.content}
                                      </div>
                                    )
                                  )}

                                  {/* Special displays */}
                                  {currentLevelData.level === 5 && password && (
                                    <div className="mt-2 p-2 bg-white rounded text-sm text-gray-600 border">
                                      <strong>Current digit sum:</strong>{" "}
                                      {getDigitSum(password)} / 25
                                    </div>
                                  )}

                                  {currentLevelData.level === 12 &&
                                    password && (
                                      <div className="mt-2 p-2 bg-white rounded text-sm text-gray-600 border">
                                        <strong>
                                          Current password length:
                                        </strong>{" "}
                                        {password.length}
                                      </div>
                                    )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. Failed Levels Section - Exclude current level */}
                    {gameState.failedLevels
                      .filter((levelNum) => levelNum !== gameState.currentLevel)
                      .sort((a, b) => a - b)
                      .map((levelNum) => {
                        const level = passwordLevels.find(
                          (l) => l.level === levelNum
                        );
                        if (!level) return null;

                        return (
                          <div
                            key={level.level}
                            className="border-2 rounded-lg p-4 transition-all duration-300 border-red-500 bg-red-50"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 bg-red-500 text-white">
                                {level.level}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-red-700">
                                  Rule {level.level}: {level.description}
                                </p>

                                {/* Level-specific extras */}
                                {level.extras?.map((extra, index) => (
                                  <div
                                    key={index}
                                    className="mt-2 p-2 bg-white rounded text-sm text-gray-600 border"
                                  >
                                    <strong>{extra.title}:</strong>{" "}
                                    {extra.content}
                                  </div>
                                ))}

                                {/* Special displays */}
                                {level.level === 5 && password && (
                                  <div className="mt-2 p-2 bg-white rounded text-sm text-gray-600 border">
                                    <strong>Current digit sum:</strong>{" "}
                                    {getDigitSum(password)} / 25
                                  </div>
                                )}

                                {level.level === 12 && password && (
                                  <div className="mt-2 p-2 bg-white rounded text-sm text-gray-600 border">
                                    <strong>Current password length:</strong>{" "}
                                    {password.length}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    {/* 3. Passed Levels Section - Exclude current level */}
                    {gameState.passedLevels
                      .filter(
                        (levelNum) =>
                          !gameState.failedLevels.includes(levelNum) &&
                          levelNum !== gameState.currentLevel &&
                          levelNum < gameState.currentLevel
                      )
                      .sort((a, b) => a - b)
                      .map((levelNum) => {
                        const level = passwordLevels.find(
                          (l) => l.level === levelNum
                        );
                        if (!level) return null;

                        return (
                          <div
                            key={level.level}
                            className="border-2 rounded-lg p-4 transition-all duration-300 border-green-500 bg-green-50"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 bg-green-500 text-white">
                                ✓
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-green-700">
                                  Rule {level.level}: {level.description}
                                </p>

                                {/* Level-specific extras */}
                                {level.extras?.map((extra, index) => (
                                  <div
                                    key={index}
                                    className="mt-2 p-2 bg-white rounded text-sm text-gray-600 border"
                                  >
                                    <strong>{extra.title}:</strong>{" "}
                                    {extra.content}
                                  </div>
                                ))}

                                {/* Special displays */}
                                {level.level === 5 && password && (
                                  <div className="mt-2 p-2 bg-white rounded text-sm text-gray-600 border">
                                    <strong>Current digit sum:</strong>{" "}
                                    {getDigitSum(password)} / 25
                                  </div>
                                )}

                                {level.level === 12 && password && (
                                  <div className="mt-2 p-2 bg-white rounded text-sm text-gray-600 border">
                                    <strong>Current password length:</strong>{" "}
                                    {password.length}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {gameState.isComplete ? (
                    <div className="text-center">
                      <Button
                        onClick={handlePasswordSubmit}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 text-lg"
                      >
                        🎉 You win! 🎉
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-2">
                      Complete all rules to win the game!
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Leaderboard Sidebar */}
              <div className="hidden lg:block w-80 xl:w-96">
                <div className="sticky top-8">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h2 className="text-lg font-semibold mb-4 text-center">
                      📊 Leaderboard
                    </h2>
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                      <Leaderboard />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
