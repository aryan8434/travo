import HotelCard from "./HotelCard";
import BusCard from "./BusCard";

export default function Message({ msg, onBook }) {
  // USER MESSAGE
  if (msg.role === "user") {
    return (
      <div className="text-right bg-blue-600 inline-block p-2 rounded">
        {msg.text}
      </div>
    );
  }

  // BOT MESSAGE
  const { type, text, results } = msg.data || {};

  return (
    <div className="space-y-3">
      {text && (
        <div className="bg-gray-800 inline-block p-2 rounded">{text}</div>
      )}

      {/* HOTEL CARDS */}
      {type === "hotel" &&
        results?.map((h, i) => <HotelCard key={i} h={h} onBook={onBook} />)}

      {/* BUS CARDS */}
      {type === "bus" &&
        results?.map((b, i) => (
          <div key={i} className="space-y-2">
            <BusCard b={b} />

            {/* GREEN BOOK BUTTON */}
            <button
              onClick={() => onBook?.(b)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
            >
              Book Bus
            </button>
          </div>
        ))}
    </div>
  );
}
