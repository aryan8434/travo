export default function Bookings({ bookings, isGuest }) {
  const getBookingName = (booking) => {
    return booking.name || booking.airline || booking.operator;
  };

  const getBookingDetails = (booking) => {
    if (booking.from && booking.to) {
      return `${booking.from} → ${booking.to}`;
    }
    return "";
  };

  return (
    <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-gray-950">
      <h2 className="text-lg sm:text-xl font-bold mb-4">My Bookings</h2>

      {isGuest ? (
        <div className="bg-blue-900 border border-blue-700 p-4 rounded text-center">
          <p className="text-blue-200 font-semibold mb-3">
            You are browsing as a guest
          </p>
          <p className="text-blue-300 text-sm mb-4">
            Please login to view and manage your bookings
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("isGuest");
              window.location.reload();
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Login Now
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-gray-400">No bookings yet</p>
      ) : (
        <div className="space-y-3">
          {[...bookings].reverse().map((b, i) => (
            <div key={i} className="bg-gray-800 p-3 sm:p-4 rounded relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    {getBookingName(b)}
                  </p>
                  {getBookingDetails(b) && (
                    <p className="text-xs sm:text-sm text-gray-300">
                      {getBookingDetails(b)}
                    </p>
                  )}
                </div>
                {b.createdAt && (
                  <p className="text-[10px] sm:text-xs text-gray-500 text-right">
                    {new Date(b.createdAt).toLocaleDateString()}
                    <br />
                    {new Date(b.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                ₹{b.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
