"use client";

interface AuditTrailProps {
  isOpen: boolean;
  onClose: () => void;
  lastQueryInfo?: {
    question?: string;
    metric?: string;
    dimensions?: string[];
    cubeEndpoint?: string;
    sqlQuery?: string;
    governancePassed?: boolean;
    latencyMs?: number;
  };
}

export default function AuditTrail({
  isOpen,
  onClose,
  lastQueryInfo = {
    question: "Why did European margins drop last quarter?",
    metric: "margin, cost, revenue",
    dimensions: ["region", "quarter", "product"],
    cubeEndpoint: "http://localhost:4000/cubejs-api/v1/load",
    sqlQuery: `SELECT 
  sales.region AS region,
  sales.quarter AS quarter,
  SUM(sales.revenue) AS total_revenue,
  SUM(sales.cost) AS total_cost,
  (SUM(sales.revenue) - SUM(sales.cost)) / SUM(sales.revenue) AS margin_pct
FROM sales_fact sales
WHERE sales.region = 'EU' AND sales.quarter = 'Q3 2025'
GROUP BY 1, 2
ORDER BY margin_pct ASC;`,
    governancePassed: true,
    latencyMs: 142,
  },
}: AuditTrailProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-lg">
              📜
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Cube.dev & SQL Audit Trail</h3>
              <p className="text-xs text-slate-400 font-mono">
                Transparent Execution Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Governance Check</span>
              <p className="font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                <span>✓</span> Approved Metric
              </p>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Semantic Layer</span>
              <p className="font-semibold text-cyan-300 mt-0.5 font-mono">Cube.dev REST API</p>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Execution Latency</span>
              <p className="font-semibold text-amber-400 mt-0.5 font-mono">
                {lastQueryInfo.latencyMs ?? 120} ms
              </p>
            </div>
          </div>

          {/* Active Question */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 font-mono uppercase">
              Target Question
            </label>
            <div className="mt-1 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 font-medium">
              "{lastQueryInfo.question}"
            </div>
          </div>

          {/* Cube.dev Endpoint */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 font-mono uppercase">
              Cube Endpoint Called
            </label>
            <div className="mt-1 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-teal-400 text-[11px]">
              GET {lastQueryInfo.cubeEndpoint}
            </div>
          </div>

          {/* Generated SQL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-400 font-mono uppercase">
                Generated Warehousing SQL
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Dialect: SQLite / Postgres</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 overflow-x-auto text-[11px] leading-relaxed">
              {lastQueryInfo.sqlQuery}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>MetricMind AI Governance v0.2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
