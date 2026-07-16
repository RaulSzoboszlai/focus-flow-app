function TasksWidget({ tasks, onToggleTask }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-900">Today's Tasks</h3>
          <button className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer">
            View All
          </button>
        </div>

        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/70 hover:border-slate-200 transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer transition"
                />
                <span
                  className={`text-sm font-medium transition-all ${task.completed ? "line-through text-slate-400" : "text-slate-700"}`}
                >
                  {task.text}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 tracking-wider">
                  {task.category}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {task.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-5 w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer">
        <span>+ Add new task</span>
      </button>
    </div>
  );
}

export default TasksWidget;
