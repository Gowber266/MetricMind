"use client";

import ReactECharts from "echarts-for-react";

export default function LineChartWidget({
    categories,
    values,
    title,
}: {
    categories: string[];
    values: number[];
    title?: string;
}) {
    const option = {
        backgroundColor: "transparent",

        title: title
            ? {
                text: title,
                textStyle: {
                    color: "#e2e8f0",
                    fontSize: 14,
                },
            }
            : undefined,

        grid: {
            left: 40,
            right: 20,
            top: 40,
            bottom: 30,
        },

        xAxis: {
            type: "category",
            data: categories,
            axisLine: {
                lineStyle: {
                    color: "#475569",
                },
            },
        },

        yAxis: {
            type: "value",
            axisLine: {
                lineStyle: {
                    color: "#475569",
                },
            },
            splitLine: {
                lineStyle: {
                    color: "#1e293b",
                },
            },
        },

        series: [
            {
                data: values,
                type: "line",
                smooth: true,
                itemStyle: {
                    color: "#3b82f6",
                },
            },
        ],
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: 260, width: "100%" }}
        />
    );
}