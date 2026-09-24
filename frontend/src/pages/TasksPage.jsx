import { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import api from "../services/api";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    time: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/tasks/all");
        setTasks(response.data);
      } catch (err) {
        console.log(err);
        setError("Couldn't load tasks.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId),
        );
      }
    } catch (err) {
      console.log(err);
      setError("Could not delete the task.");
    }
  };

  const handleEditClick = (task) => {
    setEditingId(task._id);
    setEditForm({
      title: task.title,
      category: task.category,
      time: task.time,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const submitEdit = async (taskId) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, editForm);

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === taskId ? { ...t, ...editForm } : t)),
        );
      }

      setEditingId(null);
    } catch (err) {
      console.log(err);
      setError("Could not update task.");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manage tasks
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            View history, edit or delete available tasks.
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-rose-600 bg-rose-50 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  There is no task available.
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition border-b border-slate-100 last:border-0"
                  >
                    {editingId === task._id ? (
                      <div className="flex items-center gap-3 w-full animate-fade-in">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="flex-1 text-sm p-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <select
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value,
                            })
                          }
                          className="text-sm p-2 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:border-indigo-300"
                        >
                          <option value="Personal">Personal</option>
                          <option value="Work">Work</option>
                          <option value="Health">Health</option>
                          <option value="Learning">Learning</option>
                        </select>

                        <input 
                          type="text"
                          value={editForm.time}
                          onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                          className="flex-1 text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Time (10:00am)"  />
                        </div>
                        
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => submitEdit(task._id)}
                            className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-4">
                          <div
                            className={`mt-1 w-2.5 h-2.5 rounded-full ${task.completed ? "bg-emerald-400" : "bg-amber-400"}`}
                          ></div>
                          <div>
                            <h3
                              className={`text-sm font-semibold ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}
                            >
                              {task.title}
                            </h3>
                            <div className="flex gap-3 mt-1 text-xs text-slate-500 font-medium">
                              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                                {task.category}
                              </span>
                              <span>
                                Created:{" "}
                                {new Date(task.createdAt).toLocaleDateString(
                                  "ro-RO",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(task)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                            title="Edit"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TaskPage;
