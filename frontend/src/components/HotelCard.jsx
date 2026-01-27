export default function HotelCard({ h, onBook }) {
  return (
    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
      <h2 className="font-bold text-lg">{h.name}</h2>
      <p>₹{h.price} / night</p>
      <p>{h.rating} ⭐</p>

      <button
        onClick={() => onBook(h)}
        className="mt-2 bg-green-600 px-4 py-1 rounded"
      >
        Book
      </button>
    </div>
  );
}
