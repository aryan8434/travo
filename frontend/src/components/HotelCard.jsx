export default function HotelCard({ h, onBook, booked, isProcessing }) {
  return (
    <div className="bg-gray-900 border border-gray-700 p-3 sm:p-4 rounded max-w-sm">
      <h2 className="font-bold text-sm sm:text-lg break-words">{h.name}</h2>
      <p className="text-xs sm:text-sm">₹{h.price} / night</p>
      <p className="text-xs sm:text-sm">{h.rating} ⭐</p>

      <button
        onClick={() => onBook(h)}
        disabled={booked || isProcessing}
        className={`mt-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded cursor-pointer text-xs sm:text-sm transition-colors ${
          booked || isProcessing
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {booked ? "Booked" : isProcessing ? "Processing..." : "Book"}
      </button>
    </div>
  );
}
