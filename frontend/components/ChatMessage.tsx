"use client";

import { useState } from "react";
import MetricsChart, { ChartDataset } from "@/components/charts/MetricsChart";

export interface ReasoningStep {
  tool: string;
  args?: Record<string, any>;
  result: string;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface Message {
  role: "user" | "assistant";
  text: string;
  timestamp?: string;
  reasoningSteps?: ReasoningStep[];
  chartData?: ChartDataset;
  tableData?: TableData;
  queryInfo?: {
    question?: string;
    metric?: string;
    cubeEndpoint?: string;
    sqlQuery?: string;
    latencyMs?: number;
  };
  followUps?: string[];
}

interface ChatMessageProps {
  message: Message;
  onSelectFollowUp?: (prompt: string) => void;
  onOpenAudit?: (info?: Message["queryInfo"]) => void;
}

export default function ChatMessage({
  message,
  onSelectFollowUp,
  onOpenAudit,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const [showThinking, setShowThinking] = useState(false);
  const [showTable, setShowTable] = useState(false);

  if (isUser) {
    return (
      <div className="flex justify-end my-3">
        <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
          <div className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white rounded-2xl rounded-tr-xs px-4 py-3 text-sm leading-relaxed shadow-lg shadow-teal-900/20 border border-teal-500/30">
            <p className="font-medium">{message.text}</p>
            {message.timestamp && (
              <span className="text-[10px] text-teal-200/70 block mt-1 text-right font-mono">
                {message.timestamp}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-teal-400 shrink-0">
            You
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-4">
      <div className="flex items-start gap-3 w-full max-w-full sm:max-w-[95%]">
        {/* Agent Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-teal-500/20 mt-1">
          🤖
        </div>

        {/* Assistant Content Box */}
        <div className="flex-1 glass-card rounded-2xl rounded-tl-xs p-4 border border-slate-800/80 shadow-xl space-y-3">
          {/* Assistant Header */}
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                MetricMind AI
              </span>
              <span className="text-[10px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full">
                Agentic Engine
              </span>
            </div>
            {message.timestamp && (
              <span className="text-[10px] text-slate-400 font-mono">
                {message.timestamp}
              </span>
            )}
          </div>

          {/* Reasoning Steps Accordion */}
          {message.reasoningSteps && message.reasoningSteps.length > 0 && (
            <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-hidden">
              <button
                onClick={() => setShowThinking(!showThinking)}
                className="w-full px-3 py-2 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors bg-slate-950"
              >
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-teal-400">🧠</span>
                  <span>Agent Reasoning Steps ({message.reasoningSteps.length} tools executed)</span>
                </div>
                <span className="text-[10px] text-teal-400 font-mono">
                  {showThinking ? "Hide ▲" : "View Steps ▼"}
                </span>
              </button>

              {showThinking && (
                <div className="p-3 border-t border-slate-800/80 space-y-2 font-mono text-[11px]">
                  {message.reasoningSteps.map((step, idx) => (
                    <div key={idx} className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
                        <span>Step {idx + 1}: {step.tool}</span>
                        {step.args && (
                          <span className="text-[10px] text-slate-400">
                            args: {JSON.stringify(step.args)}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 text-[10px] leading-tight bg-slate-950 p-1.5 rounded border border-slate-800/60">
                        {step.result}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Narrative Text */}
          <div className="text-sm text-slate-200 leading-relaxed space-y-2 whitespace-pre-wrap">
            {message.text}
          </div>

          {/* Chart Rendering */}
          {message.chartData && (
            <div className="mt-2">
              <MetricsChart data={message.chartData} />
            </div>
          )}

          {/* Data Table Rendering */}
          {message.tableData && (
            <div className="mt-3 rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setShowTable(!showTable)}
                className="w-full px-3 py-2 flex items-center justify-between text-xs text-slate-300 hover:text-white bg-slate-900/80 font-mono"
              >
                <span>📊 View Raw Data Table ({message.tableData.rows.length} records)</span>
                <span className="text-teal-400 text-[10px]">
                  {showTable ? "Collapse ▲" : "Expand Table ▼"}
                </span>
              </button>

              {showTable && (
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        {message.tableData.headers.map((h, i) => (
                          <th key={i} className="p-2 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {message.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/40 text-slate-200">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Message Footer Controls */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 text-xs">
            {/* Audit Trail Button */}
            {message.queryInfo && onOpenAudit && (
              <button
                onClick={() => onOpenAudit(message.queryInfo)}
                className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-md border border-cyan-500/30"
              >
                <span>📜 Inspect SQL & Cube Payload</span>
              </button>
            )}

            {/* Follow-up Prompts */}
            {message.followUps && message.followUps.length > 0 && onSelectFollowUp && (
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className="text-[11px] text-slate-400 font-mono">Suggested follow-ups:</span>
                {message.followUps.map((prompt, fIdx) => (
                  <button
                    key={fIdx}
                    onClick={() => onSelectFollowUp(prompt)}
                    className="text-[11px] bg-slate-800 hover:bg-teal-600/20 text-slate-300 hover:text-teal-200 border border-slate-700/60 hover:border-teal-500/40 px-2.5 py-1 rounded-full transition-all"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
