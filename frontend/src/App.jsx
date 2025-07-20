import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Password from "./components/PasswordField";
import GameLeaderboard from "./components/GameLeaderboard";
import FinalSequence from "./components/FinalSeq";
import ReactGA from "react-ga4";

function App() {
  useEffect(() => {
    ReactGA.initialize("G-2XGWTC30K7");
    // ReactGA.send({hitType : "pageview", page:window.location.pathname, title:"App.jsx"})
  }, []);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [isRegistered, setIsRegistered] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showNonBitGif, setShowNonBitGif] = useState(false); // New state for showing GIF
  const [isFromBIT, setIsFromBIT] = useState(null);
  const [user_id, setUsername] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isLeaderboardClosing, setIsLeaderboardClosing] = useState(false);

  // Game completion states
  const [showFinalSequence, setShowFinalSequence] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Tour guide states
  const [showTour, setShowTour] = useState(false);
  const [isTourClosing, setIsTourClosing] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  const getTourSteps = (isFromBIT) => [
    {
      title: "WELCOME TO BYPASS",
      content:
        "This is a cybersecurity puzzle game where you need to find hidden passwords and bypass security systems. Use your hacking skills to progress through different levels.",
      icon: "🚀",
      showGif: true,
      gifSrc: isFromBIT
        ? "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnZyZW9kMGIwYzBlaDEzaXBtbjBhN2gxcDljcXBnYWVyaXZ1djFrbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/077i6AULCXc0FKTj9s/giphy.gif"
        : "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXFwZ2gxd2pqOXR1c2wydmM2aGV6Yzdwbm5va3FxeGNocjFkZnhvdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/M6LTYevw2Rw5YBDBZV/giphy.gif",
    },
    {
      title: "HOW TO PLAY",
      content:
        "Explore the interface carefully and look for clues hidden in plain sight. Each level contains secrets waiting to be discovered through creative thinking and observation.",
      icon: "🎯",
      showGif: false,
    },
    {
      title: "LEADERBOARD & COMPETITION",
      content:
        "Compete with other players! Your progress is tracked and you can see how you rank against other hackers on the leaderboard. Click the BOARD button in the top navigation to view rankings.",
      icon: "🏆",
      showGif: false,
      showBoardIcon: true,
    },
    {
      title: "TOUR GUIDE ACCESS",
      content:
        "You can access this tour guide anytime by clicking on the 'BYPASS' logo or the 'B' button in the top navigation bar if you need a refresher.",
      icon: "💡",
      showGif: false,
      showBypassIcon: true,
    },
    {
      title: "READY TO HACK?",
      content:
        "You're all set! Start exploring the interface and look for your first clue. Remember: think outside the box and question everything you see.",
      icon: "🔓",
      showGif: false,
    },
  ];

  const registerMutation = useMutation({
    mutationFn: (user_id) =>
      axios.post(
        `${BACKEND_URL}/register`,
        { user_id, isFromBIT },
        { withCredentials: false }
      ),
    onSuccess: (res) => {
      const userData = res.data;
      const token = userData.auth_token;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("authToken", token);
      setAuthToken(token);
      setIsRegistered(true);

      // Start tour for new users with slight delay for better UX
      setTimeout(() => {
        setShowTour(true);
        setTourStep(0);
      }, 800);
    },
    onError: () => {
      alert("Registration failed or username exists");
    },
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("authToken");
    const tourSeen = localStorage.getItem("hasSeenTour");

    if (savedUser && savedToken) {
      setIsRegistered(true);
      setAuthToken(savedToken);
      setAnswered(true);
      setIsFromBIT(true);
      setHasSeenTour(tourSeen === "true");
    }
  }, []);

  // Function to handle game completion (called from Password component)
  const handleGameCompletion = () => {
    setGameCompleted(true);
    setShowFinalSequence(true);

    
  };

  // Show FinalSequence if game is completed
    if (showFinalSequence) {
      return <FinalSequence />;
    }

  // Function to handle final sequence completion
  // const handleFinalSequenceComplete = () => {
  //   setShowFinalSequence(false);

  //   // Show funny alert message
  //   setTimeout(() => {
  //     alert("🚨 SECURITY BREACH DETECTED! 🚨\n\nOur server has been compromised! You've successfully hacked through all our defenses.\n\nSorry for the inconvenience, but our systems need to be rebuilt from scratch.\n\nTry again to catch up to the leaderboard and show everyone who's the ultimate hacker! 😄");

  //     // Reset the game
  //     resetGame();
  //   }, 500);
  // };

  // Function to reset the game
  // const resetGame = () => {
  //   // Clear password-related data from localStorage
  //   localStorage.removeItem("password");

  //   // Reset game states
  //   setGameCompleted(false);
  //   setShowFinalSequence(false);

  //   // Force Password component to reset by re-rendering
  //   window.location.reload();
  // };

  const handleAnswer = (answer) => {
    if (answer) {
      // User is from BIT, go directly to registration
      setAnswered(true);
      setIsFromBIT(true);
    } else {
      // User is not from BIT, show GIF first
      setIsFromBIT(false);
      setShowNonBitGif(true);
    }
  };

  // Handle next button click after GIF display
  const handleNonBitNext = () => {
    setShowNonBitGif(false);
    setAnswered(true);
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!user_id) return;
    registerMutation.mutate(user_id);
  };

  const handleLeaderboardToggle = () => {
    if (showLeaderboard) {
      // Start closing animation
      setIsLeaderboardClosing(true);
      setTimeout(() => {
        setShowLeaderboard(false);
        setIsLeaderboardClosing(false);
      }, 400); // Match the transition duration
    } else {
      setShowLeaderboard(true);
      setIsLeaderboardClosing(false);
    }
  };

  const handleLeaderboardBackdropClick = () => {
    setIsLeaderboardClosing(true);
    setTimeout(() => {
      setShowLeaderboard(false);
      setIsLeaderboardClosing(false);
    }, 400);
  };

  const handleTourNext = () => {
    const tourSteps = getTourSteps(isFromBIT);
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      handleTourClose();
    }
  };

  const handleTourPrev = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const handleTourClose = () => {
    setIsTourClosing(true);
    setTimeout(() => {
      setShowTour(false);
      setIsTourClosing(false);
      setHasSeenTour(true);
      localStorage.setItem("hasSeenTour", "true");
    }, 500); // Match the transition duration
  };

  const startTourAgain = () => {
    setShowTour(true);
    setTourStep(0);
    setIsTourClosing(false);
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
              <button
                onClick={startTourAgain}
                className="w-8 h-8 border-2 border-cyan-400 bg-cyan-900/50 flex items-center justify-center hover:bg-cyan-900/80 transition-all duration-300 hover:scale-110 transform"
              >
                <span className="text-cyan-400 font-bold text-sm">B</span>
              </button>
              <button
                onClick={startTourAgain}
                className="text-cyan-400 font-bold uppercase tracking-widest hover:text-cyan-300 transition-all duration-300 hover:scale-105 transform"
              >
                BYPASS
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLeaderboardToggle}
                className="border border-yellow-400 bg-yellow-900/20 text-yellow-400 px-3 py-1 font-mono font-bold uppercase tracking-wider hover:bg-yellow-900/40 transition-all duration-300 text-xs hover:scale-105 transform hover:border-yellow-300 hover:shadow-lg hover:shadow-yellow-400/30"
              >
                {showLeaderboard ? "LEADERBOARD" : "LEADERBOARD"}
              </button>
              <div className="px-3 py-1 border border-slate-700 bg-cyan-900/20 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-900/30">
                <span className="text-cyan-500 text-sm font-mono">
                  {`@${savedUsername}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-md mx-auto pt-20">
        {/* Initial BIT student question */}
        {!answered && !showNonBitGif && !isRegistered ? (
          <div className="border-2 border-cyan-400 bg-black p-8 shadow-lg shadow-cyan-500/30 font-mono transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/40">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-cyan-400 uppercase tracking-widest animate-pulse">
                  WELCOME TO BYPASS
                </h1>
                <p className="text-cyan-300 text-sm uppercase tracking-wider">
                  &gt; ARE YOU A BIT STUDENT?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 border-2 border-green-400 bg-green-900/20 text-green-400 py-3 px-6 font-bold hover:bg-green-900/40 transform hover:scale-110 transition-all duration-300 shadow-lg shadow-green-500/30 uppercase tracking-wide hover:shadow-xl hover:shadow-green-500/50"
                >
                  YES
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 border-2 border-red-400 bg-red-900/20 text-red-400 py-3 px-6 font-bold hover:bg-red-900/40 transform hover:scale-110 transition-all duration-300 shadow-lg shadow-red-500/30 uppercase tracking-wide hover:shadow-xl hover:shadow-red-500/50"
                >
                  &gt; NO
                </button>
              </div>
            </div>
          </div>
        ) : /* Non-BIT user GIF display */
        showNonBitGif ? (
          <div className="border-2 border-purple-400 bg-black p-8 shadow-lg shadow-purple-500/30 font-mono transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/40">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-purple-400 uppercase tracking-widest">
                  WELCOME!
                </h2>
                <p className="text-purple-300 text-sm uppercase tracking-wider">
                  &gt; PREPARING EXTERNAL ACCESS...
                </p>
              </div>

              {/* GIF Display */}
              <div className="flex justify-center">
                <img
                  src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXFwZ2gxd2pqOXR1c2wydmM2aGV6Yzdwbm5va3FxeGNocjFkZnhvdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/M6LTYevw2Rw5YBDBZV/giphy.gif"
                  alt="Welcome External User"
                  className="w-32 h-32 border-2 border-purple-400 bg-purple-900/20 p-2 transform transition-all duration-500 hover:scale-110"
                />
              </div>

              <div className="space-y-3">
                <p className="text-purple-300 text-xs uppercase tracking-wider">
                  &gt; EXTERNAL USER PROTOCOL INITIATED
                </p>

                <button
                  onClick={handleNonBitNext}
                  className="w-full border-2 border-purple-400 bg-purple-900/20 text-purple-400 py-3 px-6 font-bold hover:bg-purple-900/40 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30 uppercase tracking-wide hover:shadow-xl hover:shadow-purple-500/50"
                >
                  PROCEED TO REGISTRATION &gt;
                </button>
              </div>
            </div>
          </div>
        ) : !isRegistered ? (
          <div className="border-2 border-cyan-400 bg-black p-8 shadow-lg shadow-cyan-500/30 font-mono transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/40">
            <form onSubmit={handleUsernameSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-cyan-400 uppercase tracking-widest">
                  CREATE ACCOUNT
                </h2>
                <p className="text-cyan-300 text-sm uppercase tracking-wider">
                  &gt; ENTER USERNAME TO ACCESS SYSTEM
                </p>
                {!isFromBIT && (
                  <p className="text-purple-300 text-xs uppercase tracking-wider">
                    &gt; EXTERNAL USER REGISTRATION
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    value={user_id}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black border-2 border-cyan-400 px-4 py-3 text-cyan-300 placeholder-cyan-500/70 focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/30 transition-all duration-300 font-mono uppercase tracking-wider"
                    placeholder="> ENTER USERNAME"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full border-2 border-green-400 bg-green-900/20 text-green-400 py-3 px-6 font-bold hover:bg-green-900/40 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wide hover:shadow-xl hover:shadow-green-500/50"
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
            <Password
              showLeaderboard={showLeaderboard}
              onGameComplete={handleGameCompletion}
            />
          </div>
        )}
      </div>

      {/* Tour Guide Modal */}
      {showTour && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/80 z-[100] transition-all duration-500 ease-out ${
              isTourClosing ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Modal */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[110] p-4 w-full max-w-md">
            <div
              className={`bg-black border-2 border-cyan-400 shadow-lg shadow-cyan-500/50 w-full font-mono transform transition-all duration-500 ease-out ${
                isTourClosing
                  ? "scale-90 opacity-0 -translate-y-8"
                  : "scale-100 opacity-100 translate-y-0"
              }`}
            >
              {/* Header */}
              <div className="border-b-2 border-cyan-400 bg-cyan-900/20 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-2 border-cyan-400 bg-cyan-900/50 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                      <span className="text-lg">
                        {getTourSteps(isFromBIT)[tourStep].icon}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wider">
                      {getTourSteps(isFromBIT)[tourStep].title}
                    </h3>
                  </div>
                  <button
                    onClick={handleTourClose}
                    className="text-cyan-400 hover:text-cyan-300 font-mono text-lg transition-all duration-300 hover:scale-110 transform"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-cyan-300 text-xs font-mono uppercase tracking-wider">
                    &gt; STEP {tourStep + 1} OF {getTourSteps(isFromBIT).length}
                  </p>
                  <div className="flex space-x-1">
                    {getTourSteps(isFromBIT).map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 transition-all duration-300 transform ${
                          index === tourStep
                            ? "bg-cyan-400 scale-125"
                            : index < tourStep
                            ? "bg-green-400 scale-110"
                            : "bg-gray-600 scale-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Show GIF for first step */}
                {getTourSteps(isFromBIT)[tourStep].showGif && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={getTourSteps(isFromBIT)[tourStep].gifSrc}
                      alt="Welcome Animation"
                      className="w-24 h-24 border-2 border-cyan-400 bg-cyan-900/20 p-1 transform transition-all duration-500 hover:scale-110"
                    />
                  </div>
                )}

                {/* Show Board Icon for leaderboard step */}
                {getTourSteps(isFromBIT)[tourStep].showBoardIcon && (
                  <div className="mb-4 flex justify-center">
                    <div className="border border-yellow-400 bg-yellow-900/20 text-yellow-400 px-3 py-1 font-mono font-bold uppercase tracking-wider text-xs transform transition-all duration-300 hover:scale-105">
                      LEADERBOARD
                    </div>
                  </div>
                )}

                {/* Show Bypass Icon for tour access step */}
                {getTourSteps(isFromBIT)[tourStep].showBypassIcon && (
                  <div className="mb-4 flex justify-center items-center space-x-3">
                    <div className="w-8 h-8 border-2 border-cyan-400 bg-cyan-900/50 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                      <span className="text-cyan-400 font-bold text-sm">B</span>
                    </div>
                    <div className="text-cyan-400 font-bold uppercase tracking-widest">
                      BYPASS
                    </div>
                  </div>
                )}

                <p className="text-cyan-300 text-sm leading-relaxed">
                  {getTourSteps(isFromBIT)[tourStep].content}
                </p>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-cyan-400 bg-cyan-900/10 p-3">
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleTourPrev}
                    disabled={tourStep === 0}
                    className="border border-gray-500 bg-gray-900/20 text-gray-400 px-4 py-2 font-mono font-bold uppercase tracking-wider hover:bg-gray-900/40 transition-all duration-300 text-sm disabled:opacity-30 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                  >
                    &lt; PREV
                  </button>

                  <div className="text-cyan-400 text-xs font-mono">
                    {tourStep === getTourSteps(isFromBIT).length - 1
                      ? "READY TO START!"
                      : "CONTINUE TOUR"}
                  </div>

                  <button
                    onClick={handleTourNext}
                    className="border border-green-400 bg-green-900/20 text-green-400 px-4 py-2 font-mono font-bold uppercase tracking-wider hover:bg-green-900/40 transition-all duration-300 text-sm transform hover:scale-105 hover:shadow-lg hover:shadow-green-400/30"
                  >
                    {tourStep === getTourSteps(isFromBIT).length - 1
                      ? "FINISH"
                      : "NEXT >"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Right-side Leaderboard Modal */}
      {showLeaderboard && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-all duration-400 ease-out ${
              isLeaderboardClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={handleLeaderboardBackdropClick}
          />

          {/* Modal */}
          <div
            className={`fixed top-0 right-0 h-full w-96 bg-black border-l-2 border-yellow-400 z-50 transform transition-all duration-500 ease-out shadow-2xl shadow-yellow-400/20 ${
              isLeaderboardClosing
                ? "translate-x-full opacity-0 scale-y-95"
                : "translate-x-0 opacity-100 scale-y-100"
            }`}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="border-b-2 border-yellow-400 bg-yellow-900/20 p-4 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 border-2 border-yellow-400 bg-yellow-900/50 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                      <span className="text-yellow-400 font-bold text-sm">
                        🏆
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-yellow-400 uppercase tracking-wider">
                      LEADERBOARD
                    </h3>
                  </div>
                  <button
                    onClick={handleLeaderboardToggle}
                    className="text-yellow-400 hover:text-yellow-300 font-mono text-xl transition-all duration-300 transform hover:scale-110"
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
                <div className="h-full p-4 transform transition-all duration-700 ease-out">
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
