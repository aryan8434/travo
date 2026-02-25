import { useState, useRef } from "react";

const API_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000");

export default function Signup({ goLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [usernameValidation, setUsernameValidation] = useState({
    letterCount: 0,
    digitCount: 0,
    meetsLocal: false,
    available: null,
    checking: false,
    backendMessage: "",
  });
  const [passwordValidation, setPasswordValidation] = useState({
    letterCount: 0,
    digitCount: 0,
    meetsRules: false,
  });
  const usernameCheckTimeout = useRef(null);

  function validateUsernameLocal(u) {
    const letters = (u.match(/[A-Za-z]/g) || []).length;
    const digits = (u.match(/[0-9]/g) || []).length;
    const meetsLocal = letters >= 4 && digits >= 2;
    setUsernameValidation((prev) => ({
      ...prev,
      letterCount: letters,
      digitCount: digits,
      meetsLocal,
    }));
    return meetsLocal;
  }

  function checkUsernameAvailability(u) {
    if (usernameCheckTimeout.current)
      clearTimeout(usernameCheckTimeout.current);
    if (!u.trim()) {
      setUsernameValidation((prev) => ({
        ...prev,
        available: null,
        backendMessage: "",
      }));
      return;
    }
    setUsernameValidation((prev) => ({ ...prev, checking: true }));
    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/auth/check-username`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: u }),
        });
        const data = await res.json();
        setUsernameValidation((prev) => ({
          ...prev,
          available: data.available,
          backendMessage: data.message || "",
          checking: false,
        }));
      } catch (err) {
        console.error("Username check error:", err);
        setUsernameValidation((prev) => ({
          ...prev,
          checking: false,
          backendMessage: "Could not check availability",
        }));
      }
    }, 400);
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
    const meetsLocal = validateUsernameLocal(u);
    if (meetsLocal) {
      checkUsernameAvailability(u);
    } else {
      setUsernameValidation((prev) => ({
        ...prev,
        available: null,
        backendMessage: "",
      }));
    }
  }

  function handlePasswordChange(p) {
    setPassword(p);
    validatePasswordLocal(p);
  }

  const isSignupDisabled =
    !usernameValidation.meetsLocal ||
    usernameValidation.available === false ||
    !passwordValidation.meetsRules;

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
          onChange={(e) => handleUsernameChange(e.target.value)}
        />
        <div className="text-xs mb-2 space-y-1">
          <div
            className={
              usernameValidation.letterCount >= 4
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {usernameValidation.letterCount >= 4 ? "✅" : "❌"} Letters:{" "}
            {usernameValidation.letterCount}/4
          </div>
          <div
            className={
              usernameValidation.digitCount >= 2
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {usernameValidation.digitCount >= 2 ? "✅" : "❌"} Digits:{" "}
            {usernameValidation.digitCount}/2
          </div>
          {usernameValidation.meetsLocal && (
            <div className="text-blue-400">
              {usernameValidation.checking ? "🔄 Checking availability..." : ""}
              {usernameValidation.available === true && "✅ Available"}
              {usernameValidation.available === false &&
                "❌ " + usernameValidation.backendMessage}
            </div>
          )}
        </div>

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 bg-gray-700 rounded"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
        />
        <div className="text-xs mb-2 space-y-1">
          <div
            className={
              passwordValidation.letterCount >= 4
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {passwordValidation.letterCount >= 4 ? "✅" : "❌"} Letters:{" "}
            {passwordValidation.letterCount}/4
          </div>
          <div
            className={
              passwordValidation.digitCount >= 1
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {passwordValidation.digitCount >= 1 ? "✅" : "❌"} Digits:{" "}
            {passwordValidation.digitCount}/1
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {success && (
          <p className="text-green-400 text-sm mb-2">
            Account created! Please login.
          </p>
        )}

        <button
          onClick={handleSignup}
          disabled={isSignupDisabled}
          className={`w-full py-2 rounded ${
            isSignupDisabled
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-green-600 hover:bg-green-700"
          }`}
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
