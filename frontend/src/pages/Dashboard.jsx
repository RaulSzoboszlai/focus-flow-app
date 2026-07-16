import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import MetricCard from "../components/dashboard/cards/MetricCard";
import TasksWidget from "../components/dashboard/widgets/TaskWidget";
import GoalsWidget from "../components/dashboard/widgets/GoalsWidget";
import FocusTimerWidget from "../components/dashboard/widgets/FocusTimerWidget";

function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Read 20 pages",
      category: "Personal",
      time: "9:00 AM",
      completed: true,
    },
    {
      id: 2,
      text: "Build project landing page",
      category: "Work",
      time: "11:00 AM",
      completed: false,
    },
    {
      id: 3,
      text: "Workout",
      category: "Health",
      time: "4:00 PM",
      completed: false,
    },
    {
      id: 4,
      text: "Learn TypeScript",
      category: "Learning",
      time: "6:00 PM",
      completed: false,
    },
  ]);

  const [focusMinutes, setFocusMinutes] = useState(0);

  const [dailyGoals, setDailyGoals] = useState([
    {
      id: 1,
      title: "Complete 3 tasks",
      current: 3,
      target: 3,
      type: "numeric",
    },
    {
      id: 2,
      title: "Focus for 2+ hours",
      current: 165,
      target: 120,
      type: "time",
    },
  ]);

  const handleToggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleTimerComplete = (minutes) => {
    setFocusMinutes((prev) => prev + minutes);
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const dynamicGoals = dailyGoals.map((goal) => {
    if (goal.id === 1) return { ...goal, current: completedTasksCount };
    if (goal.id === 2) return { ...goal, current: focusMinutes };
    return goal;
  });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Good morning, {user?.displayName}!
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Let's make today productive.
            </p>
          </div>
        </header>

        {/* METRICS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard
            title="Tasks Completed"
            value={completedTasksCount} // <-- Acum e dinamic!
            subtext={`+${completedTasksCount} today`}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
          />
          <MetricCard
            title="Current Streak"
            value="7 days"
            subtext="Keep it up!"
            subtextColor="text-amber-600"
            iconBg="bg-amber-50"
            iconColor="text-amber-500"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.357 2.015a.75.75 0 01.319.647c-.077.525.035 1.054.306 1.493l.276.447a5.025 5.025 0 004.066 2.33 7.5 7.5 0 01-.73 12.49 7.45 7.45 0 01-7.467.369 7.45 7.45 0 01-4.38-6.196 7.45 7.45 0 011.637-5.938c.312-.38.742-.647 1.229-.76l1.23-.287c.833-.195 1.5-.778 1.749-1.59l.345-1.121a.75.75 0 01.593-.518z" />
              </svg>
            }
          />
          {/* Adaugă și celelalte două MetricCards la fel ca înainte */}
        </section>

        {/* WIDGETS GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Coloana 1: Tasks */}
          <div className="lg:col-span-1">
            <TasksWidget tasks={tasks} onToggleTask={handleToggleTask} />
          </div>

          {/* Coloana 2: Focus Timer */}
          <div className="lg:col-span-1">
            <FocusTimerWidget onTimerComplete={handleTimerComplete} />
          </div>

          {/* Coloana 3: Daily Goals */}
          <div className="lg:col-span-1">
            <GoalsWidget goals={dynamicGoals} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
