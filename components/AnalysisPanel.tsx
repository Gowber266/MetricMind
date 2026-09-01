export default function AnalysisPanel({
    summary,
    steps,
}: {
    summary: string;
    steps: string[];
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-200">Analysis</h3>
            <p className="text-sm text-slate-400">{summary}</p>
            {steps.length > 0 && (
                <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1 pl-2">
                    {steps.map((step, i) => (
                        <li key={i}>{step}</li>
                    ))}
                </ol>
            )}
        </div>
    );
}