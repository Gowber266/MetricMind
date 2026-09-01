"use client";

import { useState } from "react";

interface SidebarProps {
  onSelectPrompt: (prompt: string) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SAMPLE_PROMPTS = [
  {
    category: "Root-Cause Analysis",
    icon: "🔍",
    query: "Why did European margins drop last quarter?",
    tag: "European Q3 Cost Anomaly",
  },
  {
    category: "Executive Summary",
    icon: "📊",
    query: "Compare Revenue vs Cost across all regions in 2025",
    tag: "Regional Breakdown",
  },
  {
    category: "Product Performance",
    icon: "🏆",
    query: "What is our highest margin product line in North America?",
    tag: "Product Margin %",
  },
  {
    category: "Governance Check",
    icon: "🛡️",
    query: "List all approved metrics and dimensions in the semantic model",
    tag: "Approved Metrics",
  },
];

const REGIONS = ["All Regions", "Europe (EU)", "North America (US)", "Asia-Pacific (APAC)"];

export default function Sidebar({
  onSelectPrompt,
  selectedRegion,
  onSelectRegion,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-20 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-30 w-72 bg-slate-900/90 border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Header section in sidebar */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Explore BI Insights
              </span>
              <button
                onClick={onToggle}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select a suggested prompt or ask plain English questions to run real semantic queries.
            </p>
          </div>

          {/* Region Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Filter Context</span>
              <span className="text-[10px] text-teal-400 font-mono">Cube.dev Filter</span>
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => onSelectRegion(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-teal-500 transition-colors"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Preset Prompts List */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Suggested Questions
            </span>
            <div className="space-y-2">
              {SAMPLE_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectPrompt(item.query);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-teal-300 flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      {item.category}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono group-hover:text-teal-300">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-snug group-hover:text-white">
                    "{item.query}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Governance Card */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex items-start gap-2.5">
            <span className="text-lg">🛡️</span>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Semantic Guardrails</h4>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Strict governance bounds prevent math hallucination. Only approved metrics are queried.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
