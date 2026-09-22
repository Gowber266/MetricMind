"use client";

export interface MetricCardData {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  icon: string;
}

interface MetricCardsProps {
  cards?: MetricCardData[];
}

const DEFAULT_CARDS: MetricCardData[] = [
  {
    label: "Total Revenue (YTD)",
    value: "$14.28M",
    change: "+12.4%",
    isPositive: true,
    subtext: "vs prior year target",
    icon: "💵",
  },
  {
    label: "Total Cost (YTD)",
    value: "$9.85M",
    change: "+18.4%",
    isPositive: false,
    subtext: "EU shipping spike detected",
    icon: "📈",
  },
  {
    label: "Operating Margin %",
    value: "31.0%",
    change: "-4.2%",
    isPositive: false,
    subtext: "Q3 2025 anomaly alert",
    icon: "⚖️",
  },
  {
    label: "Governance Status",
    value: "100% Valid",
    change: "4 Metrics",
    isPositive: true,
    subtext: "Cube.dev schema sync ok",
    icon: "🛡️",
  },
];

export default function MetricCards({ cards = DEFAULT_CARDS }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="glass-card p-3.5 rounded-2xl border border-slate-800/80 hover:border-teal-500/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 font-mono">
              {card.label}
            </span>
            <span className="text-base p-1 rounded-lg bg-slate-900 border border-slate-800">
              {card.icon}
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-teal-300 transition-colors">
              {card.value}
            </h3>
            <span
              className={`text-xs font-semibold font-mono px-2 py-0.5 rounded-full ${
                card.isPositive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              {card.change}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-1.5 font-medium truncate">
            {card.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}
