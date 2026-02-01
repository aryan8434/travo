export default function Bookings({ bookings }) {
  return (
    <div className="p-6 flex-1 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-400">No bookings yet</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => (
            <div key={i} className="bg-gray-800 p-3 rounded">
              <p className="font-semibold">{b.name}</p>
              <p className="text-sm text-gray-400">₹{b.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
