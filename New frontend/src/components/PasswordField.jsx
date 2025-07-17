import React, { useState } from "react";

const Password = () => {
  const [password, setPassword] = useState("");

  return (
    <div className="mt-20 w-full flex justify-center px-4">
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-xl px-6 py-4 text-2xl font-medium text-gray-800 border border-gray-300 rounded-xl shadow-md bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 placeholder-gray-400"
        placeholder="Enter your password..."
      />
    </div>
  );
};

export default Password;
