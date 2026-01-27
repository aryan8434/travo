import ChatBox from "../components/ChatBox";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <h1 className="text-xl font-bold p-4">TravoAI ✈️</h1>
      <ChatBox />
    </div>
  );
}
