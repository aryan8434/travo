export default function Wallet({ wallet, setWallet, isGuest }) {
  const API_URL = import.meta.env.PROD
    ? ""
    : import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    <div className="p-4 sm:p-6 flex-1 text-center space-y-4 sm:space-y-6 bg-gray-950 flex flex-col items-center justify-center">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Wallet</h2>

      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400">
        ₹{wallet}
      </p>

      {isGuest ? (
        <div className="bg-red-900 border border-red-700 p-4 rounded max-w-xs">
          <p className="text-red-200 font-semibold mb-2">Login Required</p>
          <p className="text-red-300 text-sm mb-3">
            You need to login with your account to add money to your wallet
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("isGuest");
              window.location.reload();
            }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
          >
            Login Now
          </button>
        </div>
      ) : (
        <button
          onClick={() => addMoney(5000)}
          className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-colors"
        >
          ➕ Add ₹5000
        </button>
      )}
    </div>
  );
}
