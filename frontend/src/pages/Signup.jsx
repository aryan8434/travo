import { useState } from "react";

const API_URL =
  import.meta.env.MODE === "production"
    ? "https://travo-y7yh.onrender.com"
    : "http://localhost:5000";

export default function Signup({ goLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSignup() {
    setError("");

    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Signup failed");
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Signup</h2>

        <input
          placeholder="Username"
          className="w-full p-2 mb-3 bg-gray-700 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 bg-gray-700 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {success && (
          <p className="text-green-400 text-sm mb-2">
            Account created! Please login.
          </p>
        )}

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
        >
          Create Account
        </button>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <span className="text-blue-400 cursor-pointer" onClick={goLogin}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
