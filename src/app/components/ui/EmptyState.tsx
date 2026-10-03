export default function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="text-center py-8 border border-dashed border-gray-800 rounded-lg">
      <p className="text-gray-400 text-sm">{title}</p>
      {hint && <p className="text-gray-600 text-xs mt-1">{hint}</p>}
    </div>
  );
}