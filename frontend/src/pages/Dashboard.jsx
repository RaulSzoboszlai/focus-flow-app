import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../hooks/useDashboard.js";
import MetricCard from "../components/dashboard/cards/MetricCard";
import TasksWidget from "../components/dashboard/widgets/TaskWidget";
import GoalsWidget from "../components/dashboard/widgets/GoalsWidget";
import FocusTimerWidget from "../components/dashboard/widgets/FocusTimerWidget";
import PageLayout from "../components/shared/PageLayout.jsx";
import LoadingState from "../components/shared/LoadingState.jsx";

function Dashboard() {
  const { user } = useAuth();

  const {
    tasks,
    dailyGoals,
    streak,
    customTimers,
    isLoading,
    error,
    actionError,
    refetch,
    addTask,
    toggleTask,
    completeTimer,
  } = useDashboard();

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksToday = tasks.length;
  const isAllCompleted =
    totalTasksToday > 0 && completedTasksCount === totalTasksToday;

  return (
    <PageLayout
      title={`Good morning, ${user?.displayName}!`}
      subtitle={"Let's make today productive."}
    >
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingState message="Dashboard is loading..." />
        </div>
      ) : error ? (
        <div>
          <ErrorMessage type="error" message={error} onRetry={refetch} />
        </div>
      ) : (
        <>
          {actionError && <ErrorMessage type="error" message={actionError} />}

          <section className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-4 gap-4 md:gap-6 lg:min-h-[680px]">
            <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 min-h-0">
              <TasksWidget
                tasks={tasks}
                onToggleTask={toggleTask}
                onAddTask={addTask}
              />
            </div>

            <div className="md:col-span-1 lg:col-span-1 min-h-0">
              <MetricCard
                title="Tasks Completed"
                value={`${completedTasksCount} / ${totalTasksToday}`}
                subtext={
                  totalTasksToday === 0
                    ? "No tasks for today"
                    : isAllCompleted
                      ? "All done for today!"
                      : `${totalTasksToday - completedTasksCount} tasks remaining`
                }
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
            </div>

            <div className="md:col-span-1 lg:col-span-1 min-h-0">
              <MetricCard
                title="Current Streak"
                value={streak}
                subtext="Keep it up!"
                subtextColor="text-amber-600"
                iconBg="bg-amber-50"
                iconColor="text-amber-500"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.357 2.015a.75.75 0 01.319.647c-.077.525.035 1.054.306 1.493l.276.447a5.025 5.025 0 004.066 2.33 7.5 7.5 0 01-.73 12.49 7.45 7.45 0 01-7.467.369 7.45 7.45 0 01-4.38-6.196 7.45 7.45 0 011.637-5.938c.312-.38.742-.647 1.229-.76l1.23-.287c.833-.195 1.5-.778 1.749-1.59l.345-1.121a.75.75 0 01.593-.518z" />
                  </svg>
                }
              />
            </div>

            <div className="md:col-span-1 lg:col-span-1 lg:row-span-2 min-h-0">
              <FocusTimerWidget
                onTimerComplete={completeTimer}
                timerOptions={customTimers}
              />
            </div>

            <div className="md:col-span-1 lg:col-span-2 lg:row-span-2 min-h-0">
              <GoalsWidget goals={dailyGoals} />
            </div>
          </section>
        </>
      )}
    </PageLayout>
  );
}

export default Dashboard;
