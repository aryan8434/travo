import { useState } from "react";
import Home from "./pages/Home.jsx";
import Bookings from "./pages/Bookings.jsx";
import Wallet from "./pages/Wallet.jsx";

function App() {
  const [tab, setTab] = useState("home");
  const [wallet, setWallet] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [chat, setChat] = useState([]);

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
        />
      )}

      {tab === "bookings" && <Bookings bookings={bookings} />}
      {tab === "wallet" && <Wallet wallet={wallet} setWallet={setWallet} />}

      {/* BOTTOM SLIDER */}
      <div className="flex justify-around bg-gray-800 p-3 border-t border-gray-700">
        <button
          onClick={() => setTab("home")}
          className={`cursor-pointer px-6 py-2 rounded transition ${
            tab === "home" ? "bg-gray-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          🏠 Home
        </button>
        <button
          onClick={() => setTab("bookings")}
          className={`cursor-pointer px-6 py-2 rounded transition ${
            tab === "bookings" ? "bg-gray-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          📑 My Bookings
        </button>
        <button
          onClick={() => setTab("wallet")}
          className={`cursor-pointer px-6 py-2 rounded transition ${
            tab === "wallet" ? "bg-gray-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          💰 Wallet
        </button>
      </div>
    </div>
  );
}

export default App;
