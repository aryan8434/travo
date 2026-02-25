import { useState, useEffect } from "react";
import Home from "./pages/Home.jsx";
import Bookings from "./pages/Bookings.jsx";
import Wallet from "./pages/Wallet.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
  const API_URL = import.meta.env.PROD
    ? ""
    : import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [tab, setTab] = useState("home");
  const [wallet, setWallet] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState("");
  const [isGuest, setIsGuest] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authPage, setAuthPage] = useState("login");

  /* ✅ ALWAYS call hooks at top level */
  useEffect(() => {
    if (!token) return;

    const guest = localStorage.getItem("isGuest") === "true";
    if (guest) {
      setIsGuest(true);
      setWallet(5000);
      setUsername("Guest");
      setBookings([]);
      // Load persisted guest chat history
      const savedGuestChat = localStorage.getItem("guestChatHistory");
      if (savedGuestChat) {
        try {
          setChat(JSON.parse(savedGuestChat));
        } catch (e) {
          setChat([]);
        }
      }
      return;
    }

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
        localStorage.removeItem("isGuest");
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
          isGuest={isGuest}
          onLogout={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("isGuest");
            localStorage.removeItem("guestChatHistory");
            setToken(null);
          }}
        />
      )}

      {tab === "bookings" && (
        <Bookings
          bookings={bookings}
          isGuest={isGuest}
          goLogin={() => setAuthPage("login")}
        />
      )}
      {tab === "wallet" && (
        <Wallet wallet={wallet} setWallet={setWallet} isGuest={isGuest} />
      )}

      {/* Bottom Navigation */}
      <div className="flex justify-around bg-gray-800 p-3 border-t border-gray-700">
        <button
          style={{ cursor: "pointer" }}
          onClick={() => setTab("home")}
          className={`px-4 py-2 rounded transition-colors ${
            tab === "home"
              ? "bg-gray-500 font-semibold"
              : "bg-transparent hover:bg-gray-700"
          }`}
        >
          🏠 Home
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => setTab("bookings")}
          className={`px-4 py-2 rounded transition-colors ${
            tab === "bookings"
              ? "bg-gray-500 font-semibold"
              : "bg-transparent hover:bg-gray-700"
          }`}
        >
          📑 Bookings
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => setTab("wallet")}
          className={`px-4 py-2 rounded transition-colors ${
            tab === "wallet"
              ? "bg-gray-500 font-semibold"
              : "bg-transparent hover:bg-gray-700"
          }`}
        >
          💰 Wallet
        </button>
      </div>
    </div>
  );
}

export default App;
