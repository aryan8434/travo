import HotelCard from "./HotelCard.jsx";
import BusCard from "./BusCard.jsx";
import FlightCard from "./FlightCard.jsx";

export default function Message({
  msg,
  onBook,
  bookings = [],
  bookingInProgress,
}) {
  /* USER MESSAGE */
  if (msg.role === "user") {
    return (
      <div className="w-full min-h-[48px] flex justify-end">
        <div className="bg-blue-600 p-2 rounded max-w-xs break-words">
          {msg.text}
        </div>
      </div>
    );
  }

  /* BOT MESSAGE */
  const { type, text, results } = msg.data || {};

  return (
    <div className="w-full min-h-[48px] space-y-3">
      {/* BOT TEXT */}
      {text && (
        <div className="bg-gray-800 inline-block p-2 rounded max-w-md break-words">
          {text}
        </div>
      )}

      {/* FLIGHT CARDS */}
      {type === "flight" &&
        results?.map((f, i) => {
          const id = f.id ?? f.airline ?? JSON.stringify(f);
          const booked = bookings.some((bk) => bk.itemId === id);
          return (
            <div key={i} className="min-h-[80px] w-full overflow-hidden">
              <FlightCard f={f} onBook={onBook} booked={booked} />
            </div>
          );
        })}

      {/* HOTEL CARDS */}
      {type === "hotel" &&
        results?.map((h, i) => {
          const id = h.id ?? h.name ?? JSON.stringify(h);
          const booked = bookings.some((bk) => bk.itemId === id);
          return (
            <div key={i} className="min-h-[80px] w-full overflow-hidden">
              <HotelCard h={h} onBook={onBook} booked={booked} />
            </div>
          );
        })}

      {/* BUS CARDS */}
      {type === "bus" &&
        results?.map((b, i) => {
          const id = b.id ?? b.operator ?? JSON.stringify(b);
          const booked = bookings.some((bk) => bk.itemId === id);
          return (
            <div key={i} className="min-h-[80px] w-full overflow-hidden">
              <BusCard b={b} onBook={onBook} booked={booked} />
            </div>
          );
        })}
    </div>
  );
}
