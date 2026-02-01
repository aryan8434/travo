export default function BusCard({ b, onBook, booked }) {
  return (
    <div className="bg-gray-800 p-4 rounded max-w-sm">
      <h2 className="font-semibold">{b.operator}</h2>
      <p className="text-sm">
        {b.from} → {b.to}
      </p>
      <p className="text-sm">{b.time}</p>
      <p className="font-semibold">₹{b.price}</p>

      <button
        onClick={() => onBook(b)}
        disabled={booked}
        className={`mt-2 px-4 py-1 rounded cursor-pointer ${booked ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
      >
        {booked ? "Booked" : "Book"}
      </button>
    </div>
  );
}
