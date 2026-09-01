"use client";

import { useState, FormEvent } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const QUICK_CHIPS = [
  "Why did European margins drop in Q3?",
  "Compare Revenue vs Cost across regions",
  "Top products by margin percentage",
  "Show Q1-Q4 revenue trend",
];

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <div className="border-t border-slate-800/80 p-4 glass-panel sticky bottom-0 z-30">
      {/* Quick Suggestion Chips */}
      <div className="max-w-4xl mx-auto mb-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-mono text-slate-400 shrink-0">Try asking:</span>
        {QUICK_CHIPS.map((chip, i) => (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => {
              onSend(chip);
            }}
            className="text-xs bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-teal-300 px-3 py-1 rounded-full border border-slate-800 hover:border-teal-500/40 transition-all shrink-0 font-medium disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-2 relative">
        <div className="relative flex-1">
          <input
            className="w-full rounded-2xl bg-slate-900/90 border border-slate-700/80 px-4 py-3.5 pr-10 text-sm text-slate-100 placeholder-slate-400 outline-none focus:border-teal-500/80 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner font-medium disabled:opacity-60"
            placeholder="Ask MetricMind about Revenue, Cost, or Operating Margin..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
          />
          <span className="absolute right-3 top-3.5 text-slate-400 text-xs font-mono hidden sm:block">
            ↵ Enter
          </span>
        </div>

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shrink-0"
        >
          {disabled ? (
            <>
              <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Thinking...
            </>
          ) : (
            <>
              Send
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
