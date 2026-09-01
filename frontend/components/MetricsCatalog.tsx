"use client";

interface MetricsCatalogProps {
  isOpen: boolean;
  onClose: () => void;
}

const APPROVED_METRICS = [
  {
    name: "revenue",
    type: "sum",
    description: "Total dollar amount of sales orders across all regions.",
    sql: "SUM(sales.revenue)",
    status: "Approved",
  },
  {
    name: "cost",
    type: "sum",
    description: "Total product cost, shipping, and regional logistics expenses.",
    sql: "SUM(sales.cost)",
    status: "Approved",
  },
  {
    name: "margin",
    type: "number",
    description: "Net profit computed as (Revenue - Cost).",
    sql: "SUM(sales.revenue) - SUM(sales.cost)",
    status: "Approved",
  },
  {
    name: "margin_pct",
    type: "number",
    description: "Operating margin percentage computed as (Margin / Revenue * 100).",
    sql: "(margin / revenue) * 100",
    status: "Approved",
  },
];

const APPROVED_DIMENSIONS = [
  { name: "region", type: "string", description: "Geographic sales territory (EU, US, APAC)." },
  { name: "country", type: "string", description: "Specific country location." },
  { name: "product", type: "string", description: "Product line category." },
  { name: "quarter", type: "string", description: "Fiscal quarter (e.g., Q1 2025, Q3 2025)." },
  { name: "sale_date", type: "time", description: "Date of completed transaction." },
];

export default function MetricsCatalog({ isOpen, onClose }: MetricsCatalogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 text-lg">
              🛡️
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Semantic Layer Catalog</h3>
              <p className="text-xs text-slate-400 font-mono">
                Cube.dev Governance & Approved Metrics
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Section: Metrics */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
                Approved Metrics (4)
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                Source: semantic-layer/models/sales.yml
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {APPROVED_METRICS.map((m) => (
                <div
                  key={m.name}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white font-mono text-sm">{m.name}</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-mono border border-emerald-500/20">
                      {m.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mb-2 leading-relaxed">{m.description}</p>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800/80 font-mono text-[10px] text-teal-300 truncate">
                    SQL: {m.sql}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Dimensions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono mb-3">
              Available Dimensions (5)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {APPROVED_DIMENSIONS.map((d) => (
                <div
                  key={d.name}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 font-mono text-xs">{d.name}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                      {d.type}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Governed by Cube.dev & LangChain Rules</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
