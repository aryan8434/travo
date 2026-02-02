import { useState, useRef, useEffect } from "react";
import Message from "./Message";

// API URL based on environment
const API_URL =
  import.meta.env.MODE === "production"
    ? "https://travo-y7yh.onrender.com"
    : "http://localhost:5000";

export default function ChatBox({
  wallet,
  setWallet,
  bookings,
  setBookings,
  chat,
  setChat,
}) {
  const [msg, setMsg] = useState("");
  const sessionIdRef = useRef(getSessionId());
  const [bookingInProgress, setBookingInProgress] = useState(null);

  const [showHome, setShowHome] = useState(!(chat && chat.length > 0));
  const [hideHome, setHideHome] = useState(false);
  const [typing, setTyping] = useState(false);
  const [policeCalled, setPoliceCalled] = useState(false);

  const bottomRef = useRef(null);

  function getSessionId() {
    let id = localStorage.getItem("travo_session_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("travo_session_id", id);
    }
    return id;
  }
  function ensureChatStability() {
    setChat((c) => {
      if (c.length === 0) {
        return [
          {
            role: "bot",
            data: { text: " " }, // invisible stabilizer
          },
        ];
      }
      return c;
    });
  }

  function pushChatSafely(message) {
    requestAnimationFrame(() => {
      setChat((c) => [...c, message]);
    });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  function hideHomeScreen() {
    if (!showHome) return;
    setHideHome(true);
    setTimeout(() => setShowHome(false), 500);
  }

  /* 🚨 POLICE FLOW */
  function triggerPoliceFlow() {
    hideHomeScreen();
    ensureChatStability();
    setPoliceCalled(true);

    const botId = Date.now();

    // STEP 1: Fetching location
    pushChatSafely({
      id: botId,
      role: "bot",
      data: { text: "📍 Fetching your location..." },
    });

    // STEP 2: Contacting police
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

    // STEP 3: Final message
    setTimeout(() => {
      setChat((c) =>
        c.map((m) =>
          m.id === botId
            ? {
                ...m,
                data: { text: "🚓 Police are already on their way to you." },
              }
            : m,
        ),
      );
    }, 6000);
  }

  function sendQuickMessage(text) {
    hideHomeScreen();

    pushChatSafely({ role: "user", text });
    setTyping(true);

    fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        message: text,
        policeCalled,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTyping(false);

        if (data?.intent === "police" && !policeCalled) {
          triggerPoliceFlow();
          return;
        }

        pushChatSafely({ role: "bot", data });
      });
  }

  async function sendMsg() {
    if (!msg.trim()) return;

    hideHomeScreen();
    const userText = msg;
    setMsg("");

    pushChatSafely({ role: "user", text: userText });
    setTyping(true);

    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        message: userText,
        policeCalled,
      }),
    });

    const data = await res.json();
    setTyping(false);

    if (data?.intent === "police" && !policeCalled) {
      triggerPoliceFlow();
      return;
    }

    pushChatSafely({ role: "bot", data });
  }
  async function refreshWalletAndBookings() {
    const res = await fetch(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setWallet(data.wallet);
    setBookings(data.bookings);
  }

  async function handleBook(item) {
    const itemId =
      item.id ?? item.name ?? item.operator ?? JSON.stringify(item);
    if (bookingInProgress === itemId) return;

    setBookingInProgress(itemId);
    ensureChatStability();

    const price = item.price || 500;
    const botId = Date.now();

    pushChatSafely({
      id: botId,
      role: "bot",
      data: { text: "⏳ Please wait, processing your booking..." },
    });

    setTimeout(async () => {
      if (wallet < price) {
        setChat((c) =>
          c.map((m) =>
            m.id === botId
              ? {
                  ...m,
                  data: {
                    text: "❌ Booking declined due to insufficient wallet balance.",
                  },
                }
              : m,
          ),
        );
        setBookingInProgress(null);
        return;
      }

      setChat((c) =>
        c.map((m) =>
          m.id === botId
            ? { ...m, data: { text: "⏳ Confirming your booking..." } }
            : m,
        ),
      );

      setTimeout(async () => {
        try {
          const booking = {
            name: item.airline || item.operator || item.name,
            price,
          };

          const res = await fetch(`${API_URL}/user/book`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ booking }),
          });

          if (!res.ok) {
            throw new Error("Booking API failed");
          }

          // ✅ optimistic UI update
          setBookings((b) => [...b, { id: Date.now(), ...booking }]);

          setChat((c) =>
            c.map((m) =>
              m.id === botId
                ? {
                    ...m,
                    data: {
                      text: `✅ Booking confirmed for ${booking.name}`,
                    },
                  }
                : m,
            ),
          );
          await refreshWalletAndBookings();
        } catch (err) {
          console.error("Booking error:", err);

          setChat((c) =>
            c.map((m) =>
              m.id === botId
                ? {
                    ...m,
                    data: {
                      text: "❌ Booking failed. Please try again.",
                    },
                  }
                : m,
            ),
          );
        } finally {
          setBookingInProgress(null);
        }
      }, 3000);
    }, 3000);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {showHome && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <img
            src="/homeimg.png"
            className={`w-64 transition-all duration-500 ${
              hideHome ? "scale-50 opacity-0" : "scale-100 opacity-100"
            }`}
          />

          <p className="text-gray-400 max-w-md text-center">
            Book buses, hotels, plan your trip or contact police with simple
            commands
          </p>

          <button
            onClick={() => {
              hideHomeScreen();
              pushChatSafely({ role: "user", text: "call police" });
              triggerPoliceFlow();
            }}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-semibold"
          >
            🚨 Contact Police
          </button>

          <div className="flex gap-5">
            <button
              onClick={() => sendQuickMessage("Plan trip for Delhi")}
              className="bg-green-600 px-6 py-2 rounded-full"
            >
              Plan trip for Delhi
            </button>

            <button
              onClick={() => sendQuickMessage("Book hotels under 5000")}
              className="bg-blue-600 px-6 py-2 rounded-full"
            >
              Book hotels under 5000
            </button>

            <button
              onClick={() =>
                sendQuickMessage("Book morning bus Jaipur → Delhi 500 to 1000")
              }
              className="bg-purple-600 px-6 py-2 rounded-full"
            >
              Book morning bus Jaipur → Delhi under 1000
            </button>
            <button
              onClick={() =>
                sendQuickMessage(
                  "Book morning flight Delhi → banglore upto 50000",
                )
              }
              className="bg-orange-600 px-6 py-2 rounded-full"
            >
              Book morning flight Delhi → banglore upto 50000
            </button>
          </div>
        </div>
      )}

      {!showHome && (
        <div className="flex-1 min-h-96 overflow-y-auto overflow-x-hidden p-4 space-y-4">
          {chat.map((m, i) => (
            <Message
              key={m.id || i}
              msg={m}
              onBook={handleBook}
              bookings={bookings}
              bookingInProgress={bookingInProgress}
            />
          ))}

          {typing && <div className="italic text-gray-400">Typing…</div>}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="p-4 flex gap-2 shrink-0">
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          className="flex-1 bg-gray-800 p-2 rounded resize-none"
        />
        <button onClick={sendMsg} className="bg-blue-600 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
