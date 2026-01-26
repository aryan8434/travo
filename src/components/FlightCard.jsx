export default function FlightCard({ f }) {
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2>{f.airline}</h2>
      <p>
        {f.from} → {f.to}
      </p>
      <p>{f.time}</p>
      <p>₹{f.price}</p>
    </div>
  );
}
