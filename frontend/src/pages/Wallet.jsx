export default function Wallet({ wallet, setWallet }) {
  return (
    <div className="p-6 flex-1 text-center space-y-4">
      <h2 className="text-xl font-bold">Wallet</h2>

      <p className="text-3xl font-bold">₹{wallet}</p>

      <button
        onClick={() => setWallet((w) => w + 5000)}
        className="bg-green-600 px-6 py-2 rounded-full font-semibold"
      >
        ➕ Add ₹5000
      </button>
    </div>
  );
}
