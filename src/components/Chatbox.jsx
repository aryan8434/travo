import { useState, useRef, useEffect } from "react";
import Message from "./Message";

export default function ChatBox() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  const [showHome, setShowHome] = useState(true);
  const [hideHome, setHideHome] = useState(false);
  const [typing, setTyping] = useState(false);
  const [policeCalled, setPoliceCalled] = useState(false);

  const bottomRef = useRef(null);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /* =========================
     HIDE HOME
  ========================= */
  function hideHomeScreen() {
    if (!showHome) return;
    setHideHome(true);
    setTimeout(() => setShowHome(false), 500);
  }

  /* =========================
     🚨 POLICE FLOW (SINGLE SOURCE)
  ========================= */
  function triggerPoliceFlow() {
    hideHomeScreen();
    setPoliceCalled(true);

    const botId = Date.now();

    setChat((c) => [
      ...c,
      {
        id: botId,
        role: "bot",
        data: { text: "📍 Fetching your location..." },
      },
    ]);

    setTimeout(() => {
      setChat((c) =>
        c.map((m) =>
          m.id === botId
            ? {
                ...m,
                data: { text: "📞 Contacting nearest police station..." },
              }
            : m,
        ),
      );
    }, 3000);

    setTimeout(() => {
      setChat((c) =>
        c.map((m) =>
          m.id === botId
            ? {
                ...m,
                data: { text: "🚓 Police is on their way to your location." },
              }
            : m,
        ),
      );
    }, 6000);
  }

  /* =========================
     SEND MESSAGE
  ========================= */
  async function sendMsg() {
    if (!msg.trim()) return;

    hideHomeScreen();

    const userText = msg;
    setMsg("");

    // show user message
    setChat((c) => [...c, { role: "user", text: userText }]);

    setTyping(true);

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userText,
        policeCalled: policeCalled,
      }),
    });

    const data = await res.json();
    setTyping(false);

    // 🚨 police intent → SAME flow as button
    if (data?.intent === "police" && !policeCalled) {
      triggerPoliceFlow();
      return;
    }

    // normal response
    setChat((c) => [...c, { role: "bot", data }]);
  }

  /* =========================
     BOOK HOTEL
  ========================= */
  function handleBook(hotel) {
    hideHomeScreen();

    setChat((c) => [...c, { role: "user", text: `Book ${hotel.name}` }]);

    const botId = Date.now();

    setChat((c) => [
      ...c,
      {
        id: botId,
        role: "bot",
        data: { text: "⏳ Booking, please wait..." },
      },
    ]);

    setTimeout(() => {
      setChat((c) =>
        c.map((m) =>
          m.id === botId
            ? {
                ...m,
                data: { text: `✅ Booking confirmed for ${hotel.name}` },
              }
            : m,
        ),
      );
    }, 3000);
  }

  /* =========================
     ENTER KEY
  ========================= */
  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  }

  return (
    <>
      {/* HOME SCREEN */}
      {showHome && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <img
            src="/homeimg.png"
            className={`w-64 transition-all duration-500 ${
              hideHome ? "scale-50 opacity-0" : "scale-100 opacity-100"
            }`}
          />

          <p className="text-gray-400 max-w-md">
            Book trips, hotels or contact police with simple text commands
          </p>

          <button
            onClick={() => {
              setChat((c) => [...c, { role: "user", text: "contact police" }]);
              triggerPoliceFlow();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold"
          >
            🚨 Contact Police
          </button>
        </div>
      )}

      {/* CHAT */}
      {!showHome && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chat.map((m, i) => (
            <Message key={m.id || i} msg={m} onBook={handleBook} />
          ))}

          {typing && (
            <div className="italic text-gray-400">TravoAI is typing…</div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      {/* INPUT */}
      <div className="p-4 flex gap-2">
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          className="flex-1 bg-gray-800 p-2 rounded resize-none"
          placeholder="Ask about hotels, buses, flights..."
        />
        <button onClick={sendMsg} className="bg-blue-600 px-4 rounded">
          Send
        </button>
      </div>
    </>
  );
}
