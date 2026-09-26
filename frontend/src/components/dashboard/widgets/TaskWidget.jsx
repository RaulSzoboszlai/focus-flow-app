import { useState } from "react";
import api from "../../../services/api.js";
import { NavLink } from "react-router-dom";

function TasksWidget({ tasks, onToggleTask, onAddTask }) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Personal",
    time: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || formData.title.length < 3) {
      setError("Task title must be at least 3 characters!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/tasks', formData);

      const newTask = res.data;

      if (onAddTask) {
        onAddTask(newTask);
      }

      setFormData({title: "", category: "Personal", time: ""});
      setIsAddingTask(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors[0].msg);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Failed to create task');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-900">Today's Tasks</h3>
          <NavLink to="/tasks" className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer">
            View All
          </NavLink>
        </div>

        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/70 hover:border-slate-200 transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task._id)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer transition"
                />
                <span
                  className={`text-sm font-medium transition-all ${task.completed ? "line-through text-slate-400" : "text-slate-700"}`}
                >
                  {task.title}
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

      {isAddingTask ? (
        <form onSubmit={handleSubmit} className="mt-5 p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
          {error && <div className="text-red-500 text-xs">{error}</div>}

          <input
            type="text"
            placeholder="Task title..."
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />

          <div className="flex gap-2">
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="text-xs p-2 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Health">Health</option>
              <option value="Learning">Learning</option>
            </select>

            <input
              type="text"
              placeholder="Time (10:00 am)"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="flex-1 text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="mt-5 w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>+ Add new task</span>
        </button>
      )}
    </div>
  );
}

export default TasksWidget;
