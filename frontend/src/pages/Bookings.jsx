export default function Bookings({ bookings }) {
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

      {bookings.length === 0 ? (
        <p className="text-gray-400">No bookings yet</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => (
            <div key={i} className="bg-gray-800 p-3 sm:p-4 rounded">
              <p className="font-semibold text-sm sm:text-base">
                {getBookingName(b)}
              </p>
              {getBookingDetails(b) && (
                <p className="text-xs sm:text-sm text-gray-300">
                  {getBookingDetails(b)}
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-400">₹{b.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
