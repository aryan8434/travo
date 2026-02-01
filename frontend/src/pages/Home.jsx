import ChatBox from "../components/ChatBox.jsx";

export default function Home({
  wallet,
  setWallet,
  bookings,
  setBookings,
  chat,
  setChat,
}) {
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col min-h-0 w-full overflow-hidden">
      <h1 className="text-xl font-bold p-4">TravoAI ✈️</h1>

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
