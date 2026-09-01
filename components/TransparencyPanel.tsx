"use client";
import { useState } from "react";

export default function TransparencyPanel({
    apiCall,
    sql,
}: {
    apiCall?: string;
    sql?: string;
}) {
    const [tab, setTab] = useState<"api" | "sql">("api");
    const [open, setOpen] = useState(false);

    if (!apiCall && !sql) return null;

    return (
        <div className="w-full max-w-md">
            <button onClick={() => setOpen(!open)} className="text-xs text-slate-500 underline">
                {open ? "Hide" : "View"} API Call / SQL
            </button>

            {open && (
                <div className="mt-2 rounded-lg border border-slate-800 bg-slate-950 p-3">
                    <div className="flex gap-3 mb-2 text-xs">
                        <button onClick={() => setTab("api")} className={tab === "api" ? "text-blue-400" : "text-slate-500"}>
                            API Call
                        </button>
                        <button onClick={() => setTab("sql")} className={tab === "sql" ? "text-blue-400" : "text-slate-500"}>
                            SQL
                        </button>
                        <button onClick={() => navigator.clipboard.writeText(tab === "api" ? apiCall || "" : sql || "")} className="text-xs text-slate-500 hover:text-slate-300 ml-2" > Copy </button>
                    </div>
                    <pre className="text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap">
                        {tab === "api" ? apiCall : sql}
                    </pre>
                </div>
            )}
        </div>
    );
}
