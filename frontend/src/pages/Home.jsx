import ChatBox from "../components/ChatBox.jsx";

export default function Home({
  wallet,
  setWallet,
  bookings,
  setBookings,
  chat,
  setChat,
  username,
}) {
  function logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col min-h-0 w-full overflow-hidden">
      <h1 className="text-base sm:text-lg md:text-xl font-bold p-3 sm:p-4 flex justify-between items-center bg-gray-800">
        <span className="truncate">Hello {username} 👋</span>
        <div className="flex gap-2 sm:gap-4 items-center ml-2">
          <span className="text-sm sm:text-lg whitespace-nowrap">
            💰 ₹{wallet}
          </span>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded transition-colors"
          >
            Logout
          </button>
        </div>
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
