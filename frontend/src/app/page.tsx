"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  passwordLevels,
  initialGameState,
  GameState,
} from "@/data/passwordLevels";

export default function Home() {
  const [step, setStep] = useState<"question" | "username" | "password">(
    "question"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showQuestionAnimation, setShowQuestionAnimation] = useState(false);

  const currentLevelData = passwordLevels.find(
    (level) => level.level === gameState.currentLevel
  );

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

  const checkPassword = () => {
    if (!currentLevelData) return false;
    return currentLevelData.validator(password);
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
        // Only add to failed levels if it was previously passed
        if (gameState.passedLevels.includes(levelData.level)) {
          newFailedLevels.push(levelData.level);
        }
      }
    });

    // Find the current level
    let currentLevel = 1;

    // If there are failed levels, current level is the lowest failed level
    if (newFailedLevels.length > 0) {
      currentLevel = Math.min(...newFailedLevels);
    } else {
      // Otherwise, current level is the first unpassed level
      for (let i = 1; i <= passwordLevels.length; i++) {
        if (!newPassedLevels.includes(i)) {
          currentLevel = i;
          break;
        }
      }
    }

    // If all levels are passed, we're complete
    if (newPassedLevels.length === passwordLevels.length) {
      currentLevel = passwordLevels.length;
    }

    setGameState({
      currentLevel,
      passedLevels: newPassedLevels,
      failedLevels: newFailedLevels,
      isComplete: newPassedLevels.length === passwordLevels.length,
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 w-full max-w-2xl border border-gray-700">
        {step === "question" && (
          <div
            className={`transition-all duration-500 ${
              showQuestionAnimation
                ? "opacity-0 scale-95"
                : "opacity-100 scale-100"
            }`}
          >
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
              Are you from BIT?
            </h1>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleBitQuestion(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
              >
                Yes
              </Button>
              <Button
                onClick={() => handleBitQuestion(false)}
                variant="destructive"
                className="px-8 py-2"
              >
                No
              </Button>
            </div>
          </div>
        )}

        {step === "username" && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              Enter your username
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleUsernameSubmit()}
                autoFocus
              />
              <Button
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "password" && (
          <div className="animate-fadeIn">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2 text-center">
                Hello, {username}!
              </h2>
              <p className="text-gray-300 text-center mb-4">
                Complete all password levels to proceed
              </p>

              {/* Level Progress */}
              <div className="flex gap-2 justify-center mb-4">
                {passwordLevels.map((level) => (
                  <div
                    key={level.level}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${
                        gameState.passedLevels.includes(level.level)
                          ? "bg-green-500 text-white"
                          : level.level === gameState.currentLevel
                          ? "bg-blue-500 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}
                  >
                    {level.level}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter your password..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) =>
                    e.key === "Enter" && handlePasswordSubmit()
                  }
                  autoFocus
                />
              </div>

              {/* Current Level Requirements */}
              {currentLevelData && (
                <div className="border border-gray-600 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                      ${
                        checkPassword() ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                    >
                      {currentLevelData.level}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          checkPassword() ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {currentLevelData.description}
                      </p>

                      {/* Level-specific extras */}
                      {currentLevelData.extras?.map((extra, index) => (
                        <div
                          key={index}
                          className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300"
                        >
                          <strong className="text-blue-400">
                            {extra.title}:
                          </strong>{" "}
                          {extra.content}
                        </div>
                      ))}

                      {/* Special display for level 4 digit sum */}
                      {currentLevelData.level === 4 && password && (
                        <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300">
                          <strong className="text-blue-400">
                            Current digit sum:
                          </strong>{" "}
                          {getDigitSum(password)} / 25
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Failed Levels (Show all failed levels including current if it's failing) */}
              {gameState.failedLevels.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-red-400">
                    ❌ Failed Levels (need to fix):
                  </h3>
                  {gameState.failedLevels.map((levelNum) => {
                    const levelData = passwordLevels.find(
                      (l) => l.level === levelNum
                    );
                    return (
                      <div
                        key={levelNum}
                        className="border border-red-600 rounded-lg p-4 bg-red-900/20"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold">
                            {levelNum}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-red-300">
                              {levelData?.description}
                            </p>

                            {/* Level-specific extras for failed levels */}
                            {levelData?.extras?.map((extra, index) => (
                              <div
                                key={index}
                                className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300"
                              >
                                <strong className="text-blue-400">
                                  {extra.title}:
                                </strong>{" "}
                                {extra.content}
                              </div>
                            ))}

                            {/* Special display for level 4 digit sum in failed levels */}
                            {levelData?.level === 4 && password && (
                              <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300">
                                <strong className="text-blue-400">
                                  Current digit sum:
                                </strong>{" "}
                                {getDigitSum(password)} / 25
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Passed Levels */}
              {gameState.passedLevels.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-green-400">
                    ✅ Completed Levels:
                  </h3>
                  {gameState.passedLevels.map((levelNum) => {
                    const levelData = passwordLevels.find(
                      (l) => l.level === levelNum
                    );
                    return (
                      <div
                        key={levelNum}
                        className="border border-green-600 rounded-lg p-3 bg-green-900/20"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                            {levelNum}
                          </div>
                          <p className="text-xs text-green-300">
                            {levelData?.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {gameState.isComplete ? (
                <Button
                  onClick={handlePasswordSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                >
                  🎉 Complete Challenge! 🎉
                </Button>
              ) : (
                <div className="text-center text-gray-400 text-sm py-2">
                  Complete Level {gameState.currentLevel} to continue...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
