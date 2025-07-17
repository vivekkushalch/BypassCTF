import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../App";

const Password = ({ authToken }) => {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [levelData, setLevelData] = useState(null);
  useEffect(() => {
    const savedPassword = localStorage.getItem("password");
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (password && authToken) {
        localStorage.setItem("password", password);
        console.log("Saved to localStorage:", password);

        if (password.trim()) {
          setIsSubmitting(true);
          try {
            const response = await axios.post(
              `${BACKEND_URL}/submit`,
              {
                password: password,
                auth_token: authToken,
              },
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("auto submit data", response.data);
            setLevelData(response.data);
          } catch (error) {
            console.log("auto submit error", error);
            setLevelData(null);
          } finally {
            setIsSubmitting(false);
          }
        }
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [password, authToken]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    localStorage.setItem("password", newPassword);
  };

  return (
    <div className="mt-20 w-full flex flex-col items-center px-4">
      <input
        type="text"
        value={password}
        onChange={handlePasswordChange}
        className="w-full max-w-xl px-6 py-4 text-2xl font-medium text-gray-800 border border-gray-300 rounded-xl shadow-md bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 placeholder-gray-400"
        placeholder="Enter your password..."
      />

      {/* Status indicator */}
      <div className="text-sm text-gray-500 mt-2">
        {isSubmitting ? "🔄 Validating..." : "Type your password"}
      </div>

      {/* Level data display */}
      {levelData && (
        <div className="w-full max-w-xl mt-6 space-y-4">
          {/* Current Level */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              {levelData.current_level?.name ||
                `Level ${levelData.current_level?.level}`}
            </h3>
            <div className="space-y-1">
              <p className="text-blue-700">
                <span className="font-medium">Level:</span>{" "}
                {levelData.current_level?.level || "N/A"}
              </p>
              {levelData.current_level?.description && (
                <p className="text-blue-700">
                  <span className="font-medium">Description:</span>{" "}
                  {levelData.current_level.description}
                </p>
              )}
              {levelData.current_level?.extras &&
                Object.keys(levelData.current_level.extras).length > 0 && (
                  <div className="text-blue-700">
                    <span className="font-medium">Extras:</span>
                    <div className="mt-1 space-y-1">
                      {levelData.current_level.extras.last_passed && (
                        <p className="text-sm">
                          <span className="font-medium">Last Passed:</span>{" "}
                          {new Date(
                            levelData.current_level.extras.last_passed
                          ).toLocaleString()}
                        </p>
                      )}
                      {levelData.current_level.extras.score && (
                        <p className="text-sm">
                          <span className="font-medium">Score:</span>{" "}
                          {levelData.current_level.extras.score}
                        </p>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Passed Levels */}
          {levelData?.passed_levels && levelData?.passed_levels?.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Passed Levels ({levelData.passed_levels.length})
              </h3>
              <div className="space-y-2">
                {levelData?.passed_levels?.map((levelObj, index) => (
                  <div
                    key={index}
                    className="bg-green-100 border border-green-300 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-800">
                        {levelObj.name || `Level ${levelObj.level}`}
                      </span>
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Level {levelObj.level}
                      </span>
                    </div>
                    {levelObj.description && (
                      <p className="text-green-700 text-sm mt-1">
                        {levelObj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Failed Levels */}
          {levelData?.failed_levels && levelData?.failed_levels?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Failed Levels ({levelData?.failed_levels?.length})
              </h3>
              <div className="space-y-2">
                {levelData?.failed_levels?.map((levelObj, index) => (
                  <div
                    key={index}
                    className="bg-red-100 border border-red-300 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-red-800">
                        {levelObj.name || `Level ${levelObj.level}`}
                      </span>
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Level {levelObj.level}
                      </span>
                    </div>
                    {levelObj.description && (
                      <p className="text-red-700 text-sm mt-1">
                        {levelObj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw data for debugging */}
          <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
              View Raw Data
            </summary>
            <pre className="text-xs mt-2 bg-white p-3 rounded overflow-x-auto border">
              {JSON.stringify(levelData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default Password;
