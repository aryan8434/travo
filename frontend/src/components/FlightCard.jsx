export default function FlightCard({ f, onBook, booked, isProcessing }) {
  return (
    <div className="bg-gray-800 p-3 sm:p-4 rounded max-w-sm">
      <h2 className="font-semibold text-sm sm:text-base">{f.airline}</h2>
      <p className="text-xs sm:text-sm">
        {f.from} → {f.to}
      </p>
      <p className="text-xs sm:text-sm">{f.time}</p>
      <p className="font-semibold text-sm sm:text-base">₹{f.price}</p>

      <button
        onClick={() => onBook({ ...f, name: f.airline })}
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
