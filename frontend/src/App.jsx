import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Password from "./components/PasswordField";
import GameLeaderboard from "./components/GameLeaderboard";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isFromBIT, setIsFromBIT] = useState(null);
  const [user_id, setUsername] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (user_id) =>
      axios.post(
        `${BACKEND_URL}/register`,
        { user_id, isFromBIT }, // to do
        { withCredentials: false }
      ),
    onSuccess: (res) => {
      const userData = res.data;
      const token = userData.auth_token;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("authToken", token);
      setAuthToken(token);

      setIsRegistered(true);
    },
    onError: () => {
      alert("Registration failed or username exists");
    },
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("authToken");

    if (savedUser && savedToken) {
      setIsRegistered(true);
      setAuthToken(savedToken);
      setAnswered(true);
      setIsFromBIT(true);
    }
  }, []);

  const handleAnswer = (answer) => {
    setAnswered(true);
    setIsFromBIT(true);
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!user_id) return;
    registerMutation.mutate(user_id);
  };

  const handleLeaderboardToggle = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  const savedUser = localStorage.getItem("user");
  const savedUsername = savedUser ? JSON.parse(savedUser).user_id : "";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Retro grid background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(cyan 1px, transparent 1px),
            linear-gradient(90deg, cyan 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Animated retro elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border-2 border-cyan-400/20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 border-2 border-pink-500/20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-yellow-400/20 animate-pulse delay-2000"></div>
      </div>

      {/* Retro navigation */}
      {isRegistered && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b-2 border-cyan-400">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between font-mono">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-cyan-400 bg-cyan-900/50 flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-sm">B</span>
              </div>
              <span className="text-cyan-400 font-bold uppercase tracking-widest">
                BYPASS
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLeaderboardToggle}
                className="border border-yellow-400 bg-yellow-900/20 text-yellow-400 px-3 py-1 font-mono font-bold uppercase tracking-wider hover:bg-yellow-900/40 transition-all duration-300 text-xs"
              >
                {showLeaderboard ? "HIDE" : "BOARD"}
              </button>
              <div className="px-3 py-1 border border-slate-700 bg-cyan-900/20">
                <span className="text-cyan-500 text-sm font-mono">
                  {savedUsername}
                </span>
              </div>
              {/* <div className="w-8 h-8 border-2 border-green-400 bg-green-900/50"></div> */}
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-md mx-auto pt-20">
        {!answered && !isRegistered ? (
          <div className="border-2 border-cyan-400 bg-black p-8 shadow-lg shadow-cyan-500/30 font-mono">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-cyan-400 uppercase tracking-widest">
                  WELCOME TO BYPASS
                </h1>
                <p className="text-cyan-300 text-sm uppercase tracking-wider">
                  &gt; ARE YOU A BIT STUDENT?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 border-2 border-green-400 bg-green-900/20 text-green-400 py-3 px-6 font-bold hover:bg-green-900/40 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-green-500/30 uppercase tracking-wide"
                >
                  YES
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 border-2 border-red-400 bg-red-900/20 text-red-400 py-3 px-6 font-bold hover:bg-red-900/40 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-red-500/30 uppercase tracking-wide"
                >
                  &gt; NO
                </button>
              </div>
            </div>
          </div>
        ) : !isRegistered ? (
          <div className="border-2 border-cyan-400 bg-black p-8 shadow-lg shadow-cyan-500/30 font-mono">
            <form onSubmit={handleUsernameSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-cyan-400 uppercase tracking-widest">
                  CREATE ACCOUNT
                </h2>
                <p className="text-cyan-300 text-sm uppercase tracking-wider">
                  &gt; ENTER USERNAME TO ACCESS SYSTEM
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={user_id}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black border-2 border-cyan-400 px-4 py-3 text-cyan-300 placeholder-cyan-500/70 focus:outline-none focus:border-pink-500 transition-all duration-200 font-mono uppercase tracking-wider"
                    placeholder="> ENTER USERNAME"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                </div>

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full border-2 border-green-400 bg-green-900/20 text-green-400 py-3 px-6 font-bold hover:bg-green-900/40 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wide"
                >
                  {registerMutation.isPending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                      <span>&gt; CREATING...</span>
                    </div>
                  ) : (
                    "CREATE ACCOUNT"
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full mt-8">
            <Password authToken={authToken} showLeaderboard={showLeaderboard} />
          </div>
        )}
      </div>

      {/* Retro decorative elements */}
      <div className="fixed bottom-4 left-4 text-cyan-400 text-xs font-mono uppercase tracking-wider">
        &gt; BYPASS v1.0 &lt;
      </div>

      {/* Right-side Leaderboard Modal */}
      {showLeaderboard && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
            onClick={() => setShowLeaderboard(false)}
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
                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="text-yellow-400 hover:text-yellow-300 font-mono text-xl"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-yellow-300 text-xs font-mono mt-2 uppercase tracking-wider">
                  &gt; TOP HACKERS WORLDWIDE
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
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
}

export default App;
