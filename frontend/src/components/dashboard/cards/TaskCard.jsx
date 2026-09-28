export default function TaskCard({
  task,
  isEditing,
  editForm,
  setEditForm,
  onSubmitEdit,
  onCancelEdit,
  onDelete,
  onEditClick,
  onMoveToToday,
}) {
  return (
    <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition border-b border-slate-100 last:border-0">
      {isEditing ? (
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
              onChange={(e) =>
                setEditForm({ ...editForm, time: e.target.value })
              }
              className="flex-1 text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Time (10:00am)"
            />
          </div>

          <div className="flex gap-2 ml-2">
            <button
              onClick={onSubmitEdit}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
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
                  {new Date(task.createdAt).toLocaleDateString("ro-RO")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!task.completed &&
              new Date(task.targetDate).toDateString() !==
                new Date().toDateString() && (
                <button
                  onClick={onMoveToToday}
                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                  title="Move for today"
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              )}
            {!task.completed && (
              <button
                onClick={onEditClick}
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
            )}
            <button
              onClick={onDelete}
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
  );
}
