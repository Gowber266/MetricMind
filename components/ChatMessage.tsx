import LineChartWidget from "./charts/LineChart";
import BarChartWidget from "./charts/BarChart";
import KpiCard from "./charts/KpiCard";
import TransparencyPanel from "./TransparencyPanel";
import EmptyState from "./EmptyState";

export type ChartData = {
  type: "line" | "bar" | "kpi";
  categories?: string[];
  values?: number[];
  label?: string;
  value?: string | number;
  title?: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  analysis?: { summary: string; steps: string[] };
  chart?: ChartData;
  apiCall?: string;
  sql?: string; // Day 9 addition
};

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`sm:max-w-[75%] rounded-2xl px-3 py-2 sm:px-4 text-sm ${isUser ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-100"
          }`}
      >
        {message.text}
      </div>

      {message.chart && (
        <div className=" w-full max-w-md min-h-[260px]">
          {message.chart.values?.length === 0 ? (
            <EmptyState message="No data available for this query." />
          ) : (
            <>
              {message.chart.type === "line" && (
                <LineChartWidget
                  categories={message.chart.categories || []}
                  values={message.chart.values || []}
                  title={message.chart.title}
                />
              )}
              {message.chart.type === "bar" && (
                <BarChartWidget
                  categories={message.chart.categories || []}
                  values={message.chart.values || []}
                  title={message.chart.title}
                />
              )}
              {message.chart.type === "kpi" && (
                <KpiCard label={message.chart.label || ""} value={message.chart.value || ""} />
              )}
            </>
          )}
          <TransparencyPanel apiCall={message.apiCall} sql={message.sql} />
        </div>
      )}
    </div>
  );
}