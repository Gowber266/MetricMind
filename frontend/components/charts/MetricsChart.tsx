"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";

export interface ChartDataset {
  title?: string;
  type?: "bar" | "line" | "pie" | "area";
  xAxisData?: string[];
  series: {
    name: string;
    data: number[];
    color?: string;
  }[];
  pieData?: { name: string; value: number; color?: string }[];
}

interface MetricsChartProps {
  data: ChartDataset;
  height?: string;
}

export default function MetricsChart({ data, height = "280px" }: MetricsChartProps) {
  const chartType = data.type || "bar";

  const option = useMemo(() => {
    const isPie = chartType === "pie";

    if (isPie && data.pieData) {
      return {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          backgroundColor: "#0f172a",
          borderColor: "#334155",
          textStyle: { color: "#f8fafc" },
          formatter: "{b}: ${c}k ({d}%)",
        },
        legend: {
          orient: "horizontal",
          bottom: 0,
          textStyle: { color: "#94a3b8", fontSize: 11 },
        },
        series: [
          {
            name: data.title || "Distribution",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 8,
              borderColor: "#0f172a",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: "bold",
                color: "#2dd4bf",
              },
            },
            labelLine: {
              show: false,
            },
            data: data.pieData.map((item, idx) => ({
              value: item.value,
              name: item.name,
              itemStyle: {
                color:
                  item.color ||
                  ["#14b8a6", "#06b6d4", "#6366f1", "#f59e0b", "#f43f5e"][idx % 5],
              },
            })),
          },
        ],
      };
    }

    const seriesConfig = data.series.map((s, idx) => {
      const palette = ["#14b8a6", "#f43f5e", "#6366f1", "#06b6d4", "#f59e0b"];
      const baseColor = s.color || palette[idx % palette.length];

      return {
        name: s.name,
        type: chartType === "area" ? "line" : chartType,
        data: s.data,
        smooth: true,
        barMaxWidth: 28,
        itemStyle: {
          color: baseColor,
          borderRadius: chartType === "bar" ? [4, 4, 0, 0] : 0,
        },
        areaStyle:
          chartType === "area"
            ? {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: baseColor + "66" },
                    { offset: 1, color: baseColor + "00" },
                  ],
                },
              }
            : undefined,
      };
    });

    return {
      backgroundColor: "transparent",
      title: data.title
        ? {
            text: data.title,
            left: 0,
            top: 0,
            textStyle: { color: "#f1f5f9", fontSize: 13, fontWeight: "600" },
          }
        : undefined,
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#f8fafc", fontSize: 12 },
        axisPointer: { type: "cross", crossStyle: { color: "#475569" } },
      },
      legend: {
        right: 0,
        top: 0,
        textStyle: { color: "#94a3b8", fontSize: 11 },
      },
      grid: {
        top: data.title ? 40 : 25,
        left: "3%",
        right: "3%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: data.xAxisData || ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"],
          axisLine: { lineStyle: { color: "#334155" } },
          axisLabel: { color: "#94a3b8", fontSize: 11 },
        },
      ],
      yAxis: [
        {
          type: "value",
          splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
          axisLabel: {
            color: "#94a3b8",
            fontSize: 11,
            formatter: (val: number) => `$${val}k`,
          },
        },
      ],
      series: seriesConfig,
    };
  }, [data, chartType]);

  return (
    <div className="w-full glass-card rounded-2xl p-4 border border-slate-800/80 my-3">
      <ReactECharts
        option={option}
        style={{ height, width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
}
