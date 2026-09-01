"use client";

import { useState, useEffect } from "react";

interface NavbarProps {
  onOpenCatalog: () => void;
  onOpenAudit: () => void;
  onClearChat: () => void;
  backendUrl: string;
}

export default function Navbar({
  onOpenCatalog,
  onOpenAudit,
  onClearChat,
  backendUrl,
}: NavbarProps) {
  const [isLive, setIsLive] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${backendUrl}/health`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.status === "ok") {
            setIsLive(true);
            return;
          }
        }
        setIsLive(false);
      } catch (e) {
        setIsLive(false);
      }
    }
    checkHealth();
    const timer = setInterval(checkHealth, 15000);
    return () => clearInterval(timer);
  }, [backendUrl]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 glass-panel px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo & Tag */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-600 to-indigo-600 shadow-md shadow-teal-500/20">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              MetricMind
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
                v0.2.0
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Agentic Semantic BI & Anomaly Reasoning Engine
          </p>
        </div>
      </div>

      {/* Backend Status Indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
        <span
          className={`h-2 w-2 rounded-full ${
            isLive === true
              ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
              : isLive === false
              ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
              : "bg-slate-500 animate-pulse"
          }`}
        />
        <span className="text-slate-300 font-mono text-[11px]">
          Backend:{" "}
          <strong className={isLive ? "text-emerald-400" : "text-amber-400"}>
            {isLive === true
              ? "FastAPI Live"
              : isLive === false
              ? "Scaffold / Mock Mode"
              : "Connecting..."}
          </strong>
        </span>
      </div>

      {/* Header Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCatalog}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-200 hover:text-white border border-slate-700/70 hover:border-teal-500/50 transition-all hover:bg-slate-800"
          title="View approved metrics & dimensions"
        >
          <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Metrics Catalog
        </button>

        <button
          onClick={onOpenAudit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-200 hover:text-white border border-slate-700/70 hover:border-cyan-500/50 transition-all hover:bg-slate-800"
          title="View Cube.dev API & SQL query audit logs"
        >
          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          SQL Trail
        </button>

        <button
          onClick={onClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/60 hover:bg-red-500/10 text-slate-400 hover:text-red-300 border border-slate-700/50 hover:border-red-500/30 transition-all"
          title="Reset conversation session"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Reset
        </button>
      </div>
    </header>
  );
}
