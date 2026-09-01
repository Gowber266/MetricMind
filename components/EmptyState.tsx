export default function EmptyState({ message }: { message: string }) {
    return <div className="text-center text-sm text-slate-500 py-6">{message}</div>;
}