import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { CircleCheckBig, Camera } from "lucide-react";
import GameLeaderboard from "./GameLeaderboard.jsx";

const submitPassword = async ({ password, authToken }) => {
  const response = await axios.post(`https://bypass-crjv.onrender.com/submit`, {
    password,
    auth_token: authToken,
  });
  console.log(response.data);
  return response.data;
};

const Password = ({ showLeaderboard }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [password, setPassword] = useState("");
  const [levelData, setLevelData] = useState(null);

  const { mutate } = useMutation({
    mutationFn: submitPassword,
    onSuccess: (data) => {
      setLevelData(data);
      localStorage.setItem("password", password);
    },
    onError: (err) => {
      console.error("Password submit failed", err);
    },
  });

  useEffect(() => {
    const savedPassword = localStorage.getItem("password");
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     if (password.trim() && authToken) {
  //       mutate({ password, authToken });
  //     }
  //   }, 600);

  //   return () => clearTimeout(delay);
  // }, [password]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const authToken = localStorage.getItem("authToken");

    //rate limit
    mutate({ password: newPassword, authToken });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent mb-4 font-mono tracking-wide">
          PASSWORD CHALLENGE
        </h1>
        <p className="text-cyan-300 text-lg font-mono tracking-wider uppercase">
          &gt; Enter password to access mainframe &lt;
        </p>
      </div>

      {/* Premium Input */}
      <div className="relative mb-8">
        <input
          type="text"
          value={password}
          onChange={handlePasswordChange}
          className="relative z-10 w-full bg-black border-2 border-cyan-400 px-6 py-4 text-xl font-mono text-cyan-300 placeholder-cyan-500/70 focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-cyan-500/50 transition-all duration-300 tracking-wider"
          placeholder="> ENTER ACCESS CODE..."
        />

        {/* Retro border glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 opacity-30 blur-sm animate-pulse -z-10"></div>
      </div>

      {/* Results Area */}
      {levelData && (
        <div
          key={`levelData-${levelData.current_level?.level}-${levelData.passed_levels?.length}-${levelData.failed_levels?.length}`}
          className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700"
        >
          
          {/* Current Level */}
          {levelData.current_level && (
            <div
              key={`current-${levelData.current_level.level}`}
              className={`border-2 p-6 transition-all duration-500 ease-out transform hover:scale-[1.02] animate-in zoom-in duration-600 font-mono ${
                levelData.failed_levels?.some(
                  (failedLevel) =>
                    failedLevel.level === levelData.current_level.level
                )
                  ? "bg-red-900/20 border-red-400 shadow-lg shadow-red-500/30"
                  : "bg-cyan-900/20 border-cyan-400 shadow-lg shadow-cyan-500/30"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 border-2 flex items-center justify-center font-bold text-lg ${
                    levelData.failed_levels?.some(
                      (failedLevel) =>
                        failedLevel.level === levelData.current_level.level
                    )
                      ? "border-red-400 bg-red-900/30 text-red-400"
                      : "border-cyan-400 bg-cyan-900/30 text-cyan-400"
                  }`}
                >
                  {levelData.failed_levels?.some(
                    (failedLevel) =>
                      failedLevel.level === levelData.current_level.level
                  ) ? (
                    <span className="animate-pulse">X</span>
                  ) : (
                    <span>&gt;</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-xl font-bold mb-2 transition-colors duration-300 uppercase tracking-wider ${
                      levelData.failed_levels?.some(
                        (failedLevel) =>
                          failedLevel.level === levelData.current_level.level
                      )
                        ? "text-red-400"
                        : "text-cyan-400"
                    }`}
                  >
                    {levelData.current_level.name ||
                      `LEVEL ${levelData.current_level.level}`}
                  </h3>
                  <p
                    className={`text-sm transition-colors duration-300 font-mono ${
                      levelData.failed_levels?.some(
                        (failedLevel) =>
                          failedLevel.level === levelData.current_level.level
                      )
                        ? "text-red-300"
                        : "text-cyan-300"
                    }`}
                  >
                    &gt;{" "}
                    {levelData.current_level.description ||
                      "NEW CHALLENGE DETECTED"}
                  </p>

                  {/* Image for Current Level (if imageURL is provided) */}
                  {levelData.current_level.imageURL && (
                    <div className="mt-4 flex justify-center">
                      <div className="border-2 border-pink-400 bg-pink-900/30 p-2 w-full max-w-sm">
                        <div className="text-center mb-2">
                          <span className="text-pink-400 font-bold text-sm uppercase tracking-wider">
                            WHO IS THIS POKEMON?
                          </span>
                        </div>
                        <img
                          src={levelData.current_level.imageURL}
                          alt="Pokemon Challenge"
                          className="w-full h-48 object-contain pixelated hover:scale-105 transition-transform duration-300"
                          style={{ imageRendering: "pixelated" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        {/* Fallback content if image fails */}
                        <div
                          className="w-full h-48 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-black font-bold text-2xl hidden"
                          style={{ display: "none" }}
                        >
                          🎮 POKEMON
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Failed Levels */}
          {levelData.failed_levels?.filter(
            (level) => level.level !== levelData.current_level?.level
          ).length > 0 && (
            <div
              key={`failed-section-${levelData.failed_levels.length}`}
              className="space-y-3 animate-in slide-in-from-left fade-in duration-600"
            >
              <h4 className="text-lg font-bold text-red-400 mb-4 flex items-center space-x-2 font-mono uppercase tracking-widest">
                <span className="w-3 h-3 bg-red-400 animate-pulse"></span>
                <span>&gt; FAILED ATTEMPTS</span>
              </h4>
              {levelData.failed_levels
                .filter(
                  (level) => level.level !== levelData.current_level?.level
                )
                .map((level, i) => (
                  <div
                    key={`failed-${level.level}`}
                    className="border-2 border-red-600 bg-red-900/20 p-4 transition-all duration-500 ease-out hover:bg-red-900/30 hover:translate-x-2 hover:shadow-lg hover:shadow-red-500/30 transform animate-in slide-in-from-left fade-in font-mono"
                    style={{
                      animationDelay: `${i * 100}ms`,
                      animationDuration: "600ms",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 border border-red-400 bg-red-900/50 flex items-center justify-center">
                        <span className="text-red-400 font-bold text-sm">
                          X
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-red-400 text-sm uppercase tracking-wider">
                          LEVEL {level.level}
                        </h5>
                        <p className="text-red-300 text-xs mt-1 font-mono">
                          &gt; {level.description}
                        </p>

                        {/* Image for Failed Level (if imageURL is provided) */}
                        {level.imageURL && (
                          <div className="mt-3 flex justify-center">
                            <div className="border-2 border-red-400 bg-red-900/30 p-2 w-full max-w-xs">
                              <div className="text-center mb-2">
                                <span className="text-red-400 font-bold text-xs uppercase tracking-wider">
                                  FAILED POKEMON CHALLENGE
                                </span>
                              </div>
                              <img
                                src={level.imageURL}
                                alt="Failed Pokemon Challenge"
                                className="w-full h-32 object-contain pixelated opacity-75"
                                style={{ imageRendering: "pixelated" }}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              {/* Fallback content if image fails */}
                              <div
                                className="w-full h-32 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-lg hidden"
                                style={{ display: "none" }}
                              >
                                ❌ POKEMON
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}



          {/* Passed Levels */}
          {levelData.passed_levels?.length > 0 && (
            <div
              key={`passed-section-${levelData.passed_levels.length}`}
              className="border-2 border-green-400 bg-green-900/20 p-6 transition-all duration-500 ease-out animate-in slide-in-from-bottom fade-in font-mono shadow-lg shadow-green-500/30"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 border-2 border-green-400 bg-green-900/50 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-400 uppercase tracking-widest">
                    COMPLETED LEVELS
                  </h3>
                  <p className="text-green-300 text-sm font-mono">
                    &gt; {levelData.passed_levels.length} LEVEL
                    {levelData.passed_levels.length !== 1 ? "S" : ""} PASSED
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {levelData.passed_levels.map((level, i) => (
                  <div
                    key={`passed-${level.level}`}
                    className="flex items-center space-x-3 p-3 border border-green-500/50 bg-green-900/15 hover:bg-green-900/25 transition-all duration-300 ease-out hover:translate-x-1 transform animate-in slide-in-from-right fade-in"
                    style={{
                      animationDelay: `${i * 80 + 200}ms`,
                      animationDuration: "500ms",
                    }}
                  >
                    <div className="w-6 h-6 border border-green-400 bg-green-900/50 flex items-center justify-center">
                      <span className="text-green-400 font-bold text-xs">
                        ✓
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-green-400 font-bold text-sm uppercase tracking-wider">
                        LEVEL {level.level}: {level.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Right-side Leaderboard Modal */}
      {showLeaderboard && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
            onClick={() => {}} // Prevent closing on backdrop click for now
          />

          {/* Modal */}
          <div className="fixed top-0 right-0 h-full w-96 bg-black border-l-2 border-yellow-400 z-50 transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="border-b-2 border-yellow-400 bg-yellow-900/20 p-4 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 border-2 border-yellow-400 bg-yellow-900/50 flex items-center justify-center">
                      <span className="text-yellow-400 font-bold text-sm">
                        🏆
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-yellow-400 uppercase tracking-wider">
                      LEADERBOARD
                    </h3>
                  </div>
                </div>
                <p className="text-yellow-300 text-xs font-mono mt-2 uppercase tracking-wider">
                  &gt; TOP HACKERS WORLDWIDE
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden bg-black/80">
                <div className="h-full p-4">
                  <GameLeaderboard />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Password;
