import React, { useEffect, useState } from "react";
import axios from "axios";
const Password = ({ authToken }) => {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");

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
          try {
            const response = await axios.post(
              "http://localhost:8000/submit",
              {
                password: password,
                auth_token: authToken,
              },
              {
                // headers: {
                //   Authorization: `${authToken}`,
                //   "Content-Type": "application/json",
                // },
              }
            );
            console.log("auto submit data", response.data);
          } catch (error) {
            console.log("auto submit error", error);
          }
        }
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [password]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    localStorage.setItem("password", newPassword);
  };

  return (
    <div className="mt-20 w-full flex justify-center px-4">
      <input
        type="text"
        value={password}
        onChange={handlePasswordChange}
        className="w-full max-w-xl px-6 py-4 text-2xl font-medium text-gray-800 border border-gray-300 rounded-xl shadow-md bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 placeholder-gray-400"
        placeholder="Enter your password..."
      />
    </div>
  );
};

export default Password;
