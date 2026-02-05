import { useState } from "react";

const API_URL =
  import.meta.env.MODE === "production"
    ? "https://travo-y7yh.onrender.com"
    : "http://localhost:5000";

export default function Login({ setToken, goSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameValidation, setUsernameValidation] = useState({
    letterCount: 0,
    digitCount: 0,
    meetsLocal: false,
  });
  const [passwordValidation, setPasswordValidation] = useState({
    letterCount: 0,
    digitCount: 0,
    meetsRules: false,
  });

  function validateUsernameLocal(u) {
    const letters = (u.match(/[A-Za-z]/g) || []).length;
    const digits = (u.match(/[0-9]/g) || []).length;
    const meetsLocal = letters >= 4 && digits >= 2;
    setUsernameValidation({
      letterCount: letters,
      digitCount: digits,
      meetsLocal,
    });
  }

  function validatePasswordLocal(p) {
    const letters = (p.match(/[A-Za-z]/g) || []).length;
    const digits = (p.match(/[0-9]/g) || []).length;
    const meetsRules = letters >= 4 && digits >= 1;
    setPasswordValidation({
      letterCount: letters,
      digitCount: digits,
      meetsRules,
    });
  }

  function handleUsernameChange(u) {
    setUsername(u);
    validateUsernameLocal(u);
  }

  function handlePasswordChange(p) {
    setPassword(p);
    validatePasswordLocal(p);
  }

  const isLoginDisabled =
    !usernameValidation.meetsLocal || !passwordValidation.meetsRules;

  async function handleLogin() {
    setError("");

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          placeholder="Username"
          className="w-full p-2 mb-3 bg-gray-700 rounded"
          value={username}
          onChange={(e) => handleUsernameChange(e.target.value)}
        />
        <div className="text-xs mb-2 space-y-1">
          <div className={usernameValidation.letterCount >= 4 ? "text-green-400" : "text-red-400"}>
            {usernameValidation.letterCount >= 4 ? "✅" : "❌"} Letters: {usernameValidation.letterCount}/4
          </div>
          <div className={usernameValidation.digitCount >= 2 ? "text-green-400" : "text-red-400"}>
            {usernameValidation.digitCount >= 2 ? "✅" : "❌"} Digits: {usernameValidation.digitCount}/2
          </div>
        </div>

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 bg-gray-700 rounded"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
        />
        <div className="text-xs mb-2 space-y-1">
          <div className={passwordValidation.letterCount >= 4 ? "text-green-400" : "text-red-400"}>
            {passwordValidation.letterCount >= 4 ? "✅" : "❌"} Letters: {passwordValidation.letterCount}/4
          </div>
          <div className={passwordValidation.digitCount >= 1 ? "text-green-400" : "text-red-400"}>
            {passwordValidation.digitCount >= 1 ? "✅" : "❌"} Digits: {passwordValidation.digitCount}/1
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center mt-3">
          No account?{" "}
          <span className="text-blue-400 cursor-pointer" onClick={goSignup}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}
