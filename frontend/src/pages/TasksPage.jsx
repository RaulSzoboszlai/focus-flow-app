import { useState } from "react";
import ErrorMessage from "../components/shared/ErrorMessage";
import LoadingState from "../components/shared/LoadingState";
import PageLayout from "../components/shared/PageLayout";
import TaskCard from "../components/dashboard/cards/TaskCard";
import { useTasks } from "../hooks/useTasks";

const TABS = [
  {
    id: "active",
    label: "To do",
    filter: (t) => !t.completed,
    empty: "You have no pending tasks.",
  },
  {
    id: "completed",
    label: "Completed",
    filter: (t) => t.completed,
    empty: "You haven't finished any tasks yet.",
  },
  {
    id: "all",
    label: "All",
    filter: () => true,
    empty: "You have no tasks created.",
  },
];

function TasksPage() {
  const { tasks, isLoading, error, deleteTask, updateTask, moveToToday } =
    useTasks();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    time: "",
  });
  const [activeTab, setActiveTab] = useState("active");

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
    const success = await updateTask(taskId, editForm);

    if (success) {
      setEditingId(null);
    }
  };

  const currentTab = TABS.find((tab) => tab.id === activeTab);
  const filteredTasks = tasks.filter(currentTab.filter);

  return (
    <PageLayout
      title={"Manage tasks"}
      subtitle={"View history, edit or delete available tasks."}
    >
      <div className="flex space-x-6 border-b border-slate-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingState message={"Loading tasks"} />
      ) : error ? (
        <ErrorMessage type="error" message={error} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
          <div className="divide-y divide-slate-100 overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                {currentTab.empty}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isEditing={editingId === task._id}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  onSubmitEdit={() => submitEdit(task._id)}
                  onCancelEdit={handleCancelEdit}
                  onDelete={() => deleteTask(task._id)}
                  onEditClick={() => handleEditClick(task)}
                  onMoveToToday={() => moveToToday(task._id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default TasksPage;
