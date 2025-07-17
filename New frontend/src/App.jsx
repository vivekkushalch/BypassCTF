import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "./components/Navbar";
import Password from "./components/PasswordField";

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isFromBIT, setIsFromBIT] = useState(null);
  const [user_id, setUsername] = useState("");
  const [authToken, setAuthToken] = useState(null);

  const BACKEND_URL = "http://localhost:8000";

  const registerMutation = useMutation({
    mutationFn: (user_id) =>
      axios.post(
        `${BACKEND_URL}/register`,
        { user_id },
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
    if (!answer) {
      alert("Only BIT students can proceed!");
      return;
    }

    setAnswered(true);
    setIsFromBIT(true);
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!user_id) return;
    registerMutation.mutate(user_id);
  };

  const savedUser = localStorage.getItem("user");
  const savedUsername = savedUser ? JSON.parse(savedUser).user_id : "";

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      {isRegistered && <Navbar username={savedUsername} />}

      {!answered && !isRegistered ? (
        <div className="bg-white shadow-md p-6 rounded-lg text-center space-y-4 mt-10">
          <h1 className="text-xl font-semibold">Are you from BIT?</h1>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              No
            </button>
          </div>
        </div>
      ) : !isRegistered ? (
        <form
          onSubmit={handleUsernameSubmit}
          className="bg-white shadow-md p-6 rounded-lg text-center space-y-4 mt-10"
        >
          <h2 className="text-lg font-medium">Enter your username:</h2>
          <input
            type="text"
            value={user_id}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Username"
          />
          <button
            type="submit"
            className="block mx-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </form>
      ) : (
        // ✅ Show password input box here after user is registered
        <Password authToken={authToken} />
      )}
    </div>
  );
}

export default App;
