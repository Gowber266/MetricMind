export default function KpiCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-100">{value}</p>
        </div>
    );
}