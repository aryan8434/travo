export default function FlightCard({ f, onBook, booked }) {
  return (
    <div className="bg-gray-800 p-4 rounded max-w-sm">
      <h2 className="font-semibold">{f.airline}</h2>
      <p className="text-sm">
        {f.from} → {f.to}
      </p>
      <p className="text-sm">{f.time}</p>
      <p className="font-semibold">₹{f.price}</p>

      <button
        onClick={() => onBook(f)}
        disabled={booked}
        className={`mt-2 px-4 py-1 rounded cursor-pointer ${booked ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
      >
        {booked ? "Booked" : "Book"}
      </button>
    </div>
  );
}
