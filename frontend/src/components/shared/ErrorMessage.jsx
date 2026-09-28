export default function ErrorMessage({ type = "error", message, onRetry }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      className={`p-4 rounded-xl text-sm font-medium mb-6 flex flex-col items-start gap-3 ${
        isError ? "text-rose-600 bg-rose-50" : "text-emerald-700 bg-emerald-50"
      }`}
    >
        <p>{ message }</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium cursor-pointer"
            >
                Try again
            </button>
        )}
    </div>
  );
}
