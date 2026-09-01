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
      text: 'Hi, I\'m MetricMind. Ask me anything about revenue, cost, or margin — e.g. "Why did our European margins drop last quarter?"',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
  // Day 6: Connect frontend to backend API
  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
        }),
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data = await res.json();

      const aiReply: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: data.answer || "No response received from backend.",
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      const errorReply: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text:
          " Could not reach the backend. Please check your connection and try again.",
      };

      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen flex-col bg-slate-950 text-slate-100">
      {/* Day 4: Responsive Header */}
      <header className="flex items-center gap-2 border-b border-slate-800 px-4 py-3 sm:px-6 sm:py-4">
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />

        <h1 className="text-base sm:text-lg font-semibold tracking-tight">
          MetricMind
        </h1>

        <span className="hidden sm:inline text-sm text-slate-500">
          Agentic Semantic BI Engine
        </span>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {messages.length === 1 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <p className="text-slate-500 text-sm">Try asking:</p>
              <div className="mt-3 flex flex-col gap-2">
                {["Why did European margins drop?", "Show Q3 Revenue", "Compare regional costs"].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 rounded-full px-3 py-1.5 text-slate-300"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && <TypingIndicator />}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800 px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            onSend={handleSend}
            disabled={isLoading}
          />
        </div>
      </div>
    </main>
  );
}