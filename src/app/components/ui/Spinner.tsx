export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm py-8">
      <div className="w-4 h-4 border-2 border-gray-600 border-t-emerald-500 rounded-full animate-spin" />
      {label && <span>{label}</span>}
    </div>
  );
}