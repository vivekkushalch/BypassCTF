import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../App";

const submitPassword = async ({ password, authToken }) => {
  const response = await axios.post(`https://bypass-crjv.onrender.com/submit`, {
    password,
    auth_token: authToken,
  });
  console.log(response.data);
  return response.data;
};

const Password = () => {
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
    <div className="mt-20 w-full flex flex-col items-center px-4">
      <input
        type="text"
        value={password}
        onChange={handlePasswordChange}
        className="w-full max-w-xl px-6 py-4 text-2xl font-medium text-gray-800 border border-gray-300 rounded-xl shadow-md bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 placeholder-gray-400"
        placeholder="Enter your password..."
      />

      {/* <div className="text-sm text-gray-500 mt-2">
        {password.trim() ? "🔄 Validating..." : "Type your password"}
      </div> */}

      {/* Result Area */}
      {levelData && (
        <div className="w-full max-w-xl mt-6 space-y-4">
          {/* Current Level */}
          {levelData.current_level && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                {levelData.current_level.name ||
                  `Level ${levelData.current_level.level}`}
              </h3>
              <p className="text-blue-700">
                {levelData.current_level.description ||
                  "New challenge unlocked!"}
              </p>
            </div>
          )}

          {/* Passed Levels */}
          {levelData.passed_levels?.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Passed Levels ({levelData.passed_levels.length})
              </h3>
              <ul className="space-y-2">
                {levelData.passed_levels.map((level, i) => (
                  <li key={i} className="text-green-700 text-sm">
                    ✅ Level {level.level}: {level.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Failed Levels */}
          {levelData.failed_levels?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Failed Levels ({levelData.failed_levels.length})
              </h3>
              <ul className="space-y-2">
                {levelData.failed_levels.map((level, i) => (
                  <li key={i} className="text-red-700 text-sm">
                    ❌ Level {level.level}: {level.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Password;
