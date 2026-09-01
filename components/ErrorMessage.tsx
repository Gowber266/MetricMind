export default function ErrorMessage({ text }: { text: string }) {
    return (
        <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl border border-red-800 bg-red-950/40 px-4 py-2 text-sm text-red-300">
                ⚠️ {text}
            </div>
        </div>
    );
}
