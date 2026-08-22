type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl ${isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
          }`}
      >
        {message.content}
      </div>
    </div>
  );
}