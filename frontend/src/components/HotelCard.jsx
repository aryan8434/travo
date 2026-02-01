export default function HotelCard({ h, onBook, booked }) {
  return (
    <div className="bg-gray-900 border border-gray-700 p-4 rounded max-w-sm">
      <h2 className="font-bold text-lg break-words">{h.name}</h2>
      <p>₹{h.price} / night</p>
      <p>{h.rating} ⭐</p>

      <button
        onClick={() => onBook(h)}
        disabled={booked}
        className={`mt-2 px-4 py-1 rounded cursor-pointer ${booked ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
      >
        {booked ? "Booked" : "Book"}
      </button>
    </div>
  );
}
