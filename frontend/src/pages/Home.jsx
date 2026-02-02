import ChatBox from "../components/ChatBox.jsx";

export default function Home({
  wallet,
  setWallet,
  bookings,
  setBookings,
  chat,
  setChat,
}) {
  function logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col min-h-0 w-full overflow-hidden">
      <h1 className="text-xl font-bold p-4 flex justify-between items-center">
        TravoAI ✈️
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1 rounded"
        >
          Logout
        </button>
      </h1>

      <ChatBox
        wallet={wallet}
        setWallet={setWallet}
        bookings={bookings}
        setBookings={setBookings}
        chat={chat}
        setChat={setChat}
      />
    </div>
  );
}
