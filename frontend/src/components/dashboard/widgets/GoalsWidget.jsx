function GoalsWidget({ goals }) {
  const calculateProgress = (current, target) => {
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-900">Daily Goals</h3>
        <button className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer">
          View All
        </button>
      </div>

      <div className="space-y-5">
        {goals.map((goal) => (
          <div key={goal._id} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">{goal.title}</span>
              <span className="text-xs font-bold text-slate-500">
                {goal.type === "time"
                  ? `${formatTime(goal.current)}/${formatTime(goal.target)}`
                  : `${goal.current}/${goal.target}`}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${calculateProgress(goal.current, goal.target)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalsWidget;
