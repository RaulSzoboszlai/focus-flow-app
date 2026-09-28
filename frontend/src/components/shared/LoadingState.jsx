export default function LoadingState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 w-full animate-fade-in">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      {message && (
        <p className="text-slate-500 text-sm font-medium">{ message }</p>
      )}
    </div>
  );
}
