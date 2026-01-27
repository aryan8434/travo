export default function BusCard({ b }) {
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2>{b.operator}</h2>
      <p>
        {b.from} → {b.to}
      </p>
      <p>{b.time}</p>
      <p>₹{b.price}</p>
    </div>
  );
}
