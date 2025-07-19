import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  Trophy,
  Target,
} from "lucide-react";

const MazeFrontend = ({ onMazeComplete }) => {
  // Define a more complex maze structure - simple visual design but challenging path
  const maze = [
    [
      "S",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
    ],
    [
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "1",
      "1",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "0",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "0",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "0",
      "1",
      "1",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "1",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
    ],
    [
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "0",
      "1",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
    ],
    [
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "1",
      "0",
      "1",
      "1",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "0",
      "0",
      "1",
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "1",
      "1",
      "1",
      "0",
      "0",
      "0",
      "1",
    ],
    [
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0",
      "1",
      "1",
      "0",
      "0",
      "1",
      "0",
      "0",
      "1",
      "0",
      "0",
    ],
    [
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "E",
    ],
  ];

  const [currentPos, setCurrentPos] = useState([0, 0]);
  const [moves, setMoves] = useState("");
  const [gameState, setGameState] = useState("playing"); // 'playing', 'won', 'lost'
  const [path, setPath] = useState([[0, 0]]);
  const [attempts, setAttempts] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Reset the game
  const resetGame = () => {
    setCurrentPos([0, 0]);
    setMoves("");
    setGameState("playing");
    setPath([[0, 0]]);
  };

  // Check if position is valid
  const isValidPosition = (row, col) => {
    return (
      row >= 0 && row < 30 && col >= 0 && col < 30 && maze[row][col] !== "1"
    );
  };

  // Handle move
  const makeMove = (direction) => {
    if (gameState !== "playing") return;

    const directions = {
      U: [-1, 0],
      D: [1, 0],
      L: [0, -1],
      R: [0, 1],
    };

    const [dy, dx] = directions[direction];
    const newRow = currentPos[0] + dy;
    const newCol = currentPos[1] + dx;

    // Check if move is valid
    if (!isValidPosition(newRow, newCol)) {
      setGameState("lost");
      setAttempts((prev) => prev + 1);
      // Auto-reset after 1 second
      setTimeout(() => {
        resetGame();
      }, 1000);
      return;
    }

    // Update position and moves
    const newPos = [newRow, newCol];
    setCurrentPos(newPos);
    setMoves((prev) => prev + direction);
    setPath((prev) => [...prev, newPos]);

    // Check if reached end
    if (newRow === 29 && newCol === 29) {
      setGameState("won");
      setLevelCompleted(true);
      setShowCelebration(true);
      setAttempts((prev) => prev + 1);

      // Call the completion callback to submit to backend
      if (onMazeComplete) {
        // Get the last password from localStorage and append "maze_completed"
        const lastPassword = localStorage.getItem("password") || "";
        const completionPassword = lastPassword + "maze_completed";

        // Store the completion password but keep the original password intact
        localStorage.setItem("password", lastPassword); // Ensure original is preserved

        setTimeout(() => {
          onMazeComplete(completionPassword);
        }, 3000); // Wait for celebration to show
      } // Hide celebration after 3 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameState !== "playing") return;

      const keyMap = {
        ArrowUp: "U",
        ArrowDown: "D",
        ArrowLeft: "L",
        ArrowRight: "R",
        w: "U",
        W: "U",
        s: "D",
        S: "D",
        a: "L",
        A: "L",
        d: "R",
        D: "R",
      };

      const move = keyMap[event.key];
      if (move) {
        event.preventDefault();
        makeMove(move);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, currentPos]);

  // Get cell style - simplified design like the image
  const getCellStyle = (row, col) => {
    const isCurrentPos = currentPos[0] === row && currentPos[1] === col;
    const isInPath = path.some(([r, c]) => r === row && c === col);

    // Simple clean design with consistent sizing - responsive
    let baseStyle =
      "w-1 h-1 sm:w-2 sm:h-2 md:w-3 md:h-3 border border-gray-400 flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200";

    if (maze[row][col] === "1") {
      // Black walls like in the image
      return baseStyle + " bg-black border-black";
    } else if (maze[row][col] === "S") {
      // Red start square
      return (
        baseStyle +
        " bg-red-500 border-red-500" +
        (isCurrentPos ? " ring-2 ring-blue-400" : "")
      );
    } else if (maze[row][col] === "E") {
      // Red end square with target
      return (
        baseStyle +
        " bg-red-500 border-red-500" +
        (isCurrentPos ? " ring-2 ring-blue-400" : "")
      );
    } else {
      // White path with simple blue trail
      let pathStyle = isInPath
        ? " bg-blue-100 border-blue-200"
        : " bg-white border-gray-400";
      if (isCurrentPos) {
        pathStyle += " ring-2 ring-blue-400 bg-blue-200";
      }
      return baseStyle + pathStyle;
    }
  };

  // Get cell content - minimal like the image, responsive sizes
  const getCellContent = (row, col) => {
    const isCurrentPos = currentPos[0] === row && currentPos[1] === col;

    if (isCurrentPos) {
      return (
        <div className="w-1 h-1 sm:w-2 sm:h-2 bg-blue-600 rounded-full"></div>
      );
    } else if (maze[row][col] === "E") {
      return (
        <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
      );
    } else {
      return "";
    }
  };

  // Get next level button
  const NextLevelButton = () => {
    if (!levelCompleted) return null;

    return (
      <div className="">
        {/* <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 text-center">
                    <p className="text-lg text-gray-700 mb-2">
                        🎉 Maze completed!
                    </p>
                    <div className="flex justify-center items-center gap-2 text-blue-600">
                        <Trophy size={20} />
                        <span className="font-mono bg-yellow-200 px-2 py-1 rounded">MAZE_COMPLETE_17</span>
                    </div>
                </div> */}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-2 sm:p-4  min-h-screen">
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 text-center shadow-2xl transform scale-110 animate-pulse max-w-sm sm:max-w-md mx-auto">
            <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">🎉</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-4">
              Maze Complete!
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-gray-700 mb-2 sm:mb-4">
              Congratulations! You solved the maze!
            </p>
          </div>
        </div>
      )}

      <div className="p-4 max-w-5xl mx-auto">
        {/* Game Status */}
        <div className="flex justify-center mb-3 sm:mb-6">
          {gameState === "lost" && (
            <div className="flex items-center gap-2 sm:gap-3 text-red-600 bg-red-100 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-lg font-semibold">
              <XCircle size={20} />
              <span className="text-xs sm:text-base">
                Oops! Invalid move. Resetting...
              </span>
            </div>
          )}
        </div>

        {/* Maze Grid - Clean simple design */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="inline-block bg-gray-200 p-1 sm:p-2 rounded-lg max-w-full overflow-auto">
            {maze.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellStyle(rowIndex, colIndex)}
                  >
                    {getCellContent(rowIndex, colIndex)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Controls - Clean button design */}
        <div className="flex justify-center mb-3 sm:mb-6">
          <div className=" p-2 sm:p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-1 sm:gap-2 w-32 sm:w-48">
              <div></div>
              <button
                onClick={() => makeMove("U")}
                disabled={gameState !== "playing"}
                className="flex items-center justify-center p-2 sm:p-3 bg-blue-600 text-gray-700 rounded border-2 border-gray-400 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors font-bold text-sm sm:text-base"
              >
                ↑
              </button>
              <div></div>

              <button
                onClick={() => makeMove("L")}
                disabled={gameState !== "playing"}
                className="flex items-center justify-center p-2 sm:p-3 bg-blue-600 text-gray-700 rounded border-2 border-gray-400 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors font-bold text-sm sm:text-base"
              >
                ←
              </button>
              <button
                onClick={resetGame}
                className="flex items-center justify-center p-2 sm:p-3 bg-gray-500 text-white rounded border-2 border-gray-600 hover:bg-blue-700 transition-colors font-bold text-sm sm:text-base"
              >
                ⟲
              </button>
              <button
                onClick={() => makeMove("R")}
                disabled={gameState !== "playing"}
                className="flex items-center justify-center p-2 sm:p-3 bg-blue-600 text-gray-700 rounded border-2 border-gray-400 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors font-bold text-sm sm:text-base"
              >
                →
              </button>

              <div></div>
              <button
                onClick={() => makeMove("D")}
                disabled={gameState !== "playing"}
                className="flex items-center justify-center p-2 sm:p-3 bg-blue-600 text-gray-700 rounded border-2 border-gray-400 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors font-bold text-sm sm:text-base"
              >
                ↓
              </button>
              <div></div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 px-2">
          Use arrow keys or click buttons to move. Avoid black walls!
        </div>

        {/* Next Level Button */}
        <NextLevelButton />
      </div>
    </div>
  );
};

export default MazeFrontend;
