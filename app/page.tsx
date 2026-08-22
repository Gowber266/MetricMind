"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage, { Message } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I'm MetricMind. Ask me anything about revenue, cost, or margin — e.g. \"Why did our European margins drop last quarter?\"",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom whenever a new message arrives
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // TODO (Day 6): Replace this with a real call to Raj's backend API
    // e.g. const res = await fetch("/api/query", { method: "POST", body: JSON.stringify({ question: text }) });
    // Using a mock response for now
    setTimeout(() => {
      const mockReply: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: `(Mock response) You asked: "${text}". Once the backend is connected, real data + charts will appear here.`,
      };
      setMessages((prev) => [...prev, mockReply]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <main className="flex h-screen flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-slate-800 px-6 py-4">
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <h1 className="text-lg font-semibold tracking-tight">MetricMind</h1>
        <span className="text-sm text-slate-500">Agentic Semantic BI Engine</span>
      </header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </main>
  );
}
