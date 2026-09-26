import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import MetricCard from "../components/dashboard/cards/MetricCard";
import TasksWidget from "../components/dashboard/widgets/TaskWidget";
import GoalsWidget from "../components/dashboard/widgets/GoalsWidget";
import FocusTimerWidget from "../components/dashboard/widgets/FocusTimerWidget";
import { useEffect } from "react";
import api from '../services/api.js';

function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [customTimers, setCustomTimers] = useState([15, 30, 45, 60]);
  const [dailyGoals, setDailyGoals] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [tasksResponse, goalsResponse, userResponse] = await Promise.all([
          api.get('/tasks'),
          api.get('/goals/today'),
          api.get('/auth/me')
        ]);

        setTasks(tasksResponse.data);
        setDailyGoals(goalsResponse.data.goals);
        setStreak(goalsResponse.data.streak);

        if (userResponse.data?.settings?.focusTimers) {
          setCustomTimers(userResponse.data.settings.focusTimers);
        }

        const timeGoal = goalsResponse.data.goals.find(goal => goal.type === 'time');
        if (timeGoal) {
          setFocusMinutes(timeGoal.current);
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Couldn't get retrieve data. Please try again.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/toggle`);

      if (response.status === 200) {
        setTasks(tasks.map(task => task._id === taskId ? { ...task, completed: !task.completed } : task));

        const goalsResponse = await api.get('/goals/today');
        setDailyGoals(goalsResponse.data.goals);
        setStreak(goalsResponse.data.streak);
      }
    } catch (err) {
      console.log(err);
      alert("Error occured. Task status couldn't be saved.");
    }
  };

  const handleTimerComplete = async (minutes) => {
    setFocusMinutes((prev) => prev + minutes);
    
    try {
      const response = await api.patch('/goals/focus', { minutes });

      if (response.status === 200) {
        const goalsResponse = await api.get('/goals/today');

        setDailyGoals(goalsResponse.data.goals);
        setStreak(goalsResponse.data.streak);
      }
    } catch (err) {
      console.log(err);
      alert('Error occured. There is a problem with focus time.');
    }
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Dashboard is loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center font-sans p-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-md text-center">
          <p className="text-rose-600 font-semibold mb-2">Something went wrong!</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium cursor-pointer">Try again</button>
        </div>
      </div>
    );
  }

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

        <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard
            title="Tasks Completed"
            value={completedTasksCount} 
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
            value={streak}
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
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
    
          <div className="lg:col-span-1">
            <TasksWidget tasks={tasks} onToggleTask={handleToggleTask} onAddTask={handleAddTask} />
          </div>

          <div className="lg:col-span-1">
            <FocusTimerWidget onTimerComplete={handleTimerComplete} timerOptions={customTimers}/>
          </div>

          <div className="lg:col-span-1">
            <GoalsWidget goals={dailyGoals} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
