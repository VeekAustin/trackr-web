export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-950 border border-red-900 rounded-lg p-4 text-center">
      <p className="text-red-400 text-sm mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-red-300 underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}