export default function Wallet({ wallet, setWallet }) {
  const API_URL =
    import.meta.env.MODE === "production"
      ? "https://travo-y7yh.onrender.com"
      : "http://localhost:5000";

  async function addMoney(amount = 5000) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // persist in backend
      await fetch(`${API_URL}/user/wallet/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      // refresh wallet
      const res = await fetch(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWallet(data.wallet || 0);
    } catch (err) {
      console.error("Failed to add money:", err);
    }
  }

  return (
    <div className="p-6 flex-1 text-center space-y-4">
      <h2 className="text-xl font-bold">Wallet</h2>

      <p className="text-3xl font-bold">₹{wallet}</p>

      <button
        onClick={() => addMoney(5000)}
        className="bg-green-600 px-6 py-2 rounded-full font-semibold"
      >
        ➕ Add ₹5000
      </button>
    </div>
  );
}
