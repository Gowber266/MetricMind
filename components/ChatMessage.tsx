export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-emerald-600 text-white"
            : "bg-slate-800 text-slate-100 border border-slate-700"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
