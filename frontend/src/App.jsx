import { useState, useEffect } from "react";
import Home from "./pages/Home.jsx";
import Bookings from "./pages/Bookings.jsx";
import Wallet from "./pages/Wallet.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
  const API_URL =
    import.meta.env.MODE === "production"
      ? "https://travo-y7yh.onrender.com"
      : "http://localhost:5000";
  const [tab, setTab] = useState("home");
  const [wallet, setWallet] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authPage, setAuthPage] = useState("login");

  /* ✅ ALWAYS call hooks at top level */
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setWallet(data.wallet || 0);
        setBookings(data.bookings || []);
        setUsername(data.username || "");
      })
      .catch(() => {
        // token invalid → logout
        localStorage.removeItem("token");
        setToken(null);
      });
  }, [token]);

  /* ✅ CONDITIONAL RENDER AFTER hooks */
  if (!token) {
    return authPage === "login" ? (
      <Login setToken={setToken} goSignup={() => setAuthPage("signup")} />
    ) : (
      <Signup goLogin={() => setAuthPage("login")} />
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {tab === "home" && (
        <Home
          wallet={wallet}
          setWallet={setWallet}
          bookings={bookings}
          setBookings={setBookings}
          chat={chat}
          setChat={setChat}
          username={username}
        />
      )}

      {tab === "bookings" && <Bookings bookings={bookings} />}
      {tab === "wallet" && <Wallet wallet={wallet} setWallet={setWallet} />}

      {/* Bottom Navigation */}
      <div className="flex justify-around bg-gray-800 p-3 border-t border-gray-700">
        <button style={{ cursor: "pointer" }} onClick={() => setTab("home")}>
          🏠 Home
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => setTab("bookings")}
        >
          📑 Bookings
        </button>
        <button style={{ cursor: "pointer" }} onClick={() => setTab("wallet")}>
          💰 Wallet
        </button>
      </div>
    </div>
  );
}

export default App;
