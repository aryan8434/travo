export default function ReceiptCard({ hotel }) {
  const bookingId = Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="bg-green-900 border border-green-600 p-4 rounded">
      <h2 className="text-green-400 font-bold text-lg">✅ Booking Confirmed</h2>
      <p className="mt-2">Hotel: {hotel.name}</p>
      <p>Amount Paid: ₹{hotel.price}</p>
      <p>Booking ID: #{bookingId}</p>
      <p className="text-sm text-gray-300 mt-2">
        Thank you for booking with TravoAI
      </p>
    </div>
  );
}
