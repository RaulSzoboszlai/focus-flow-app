import { useState, useEffect, useCallback } from "react";
import api from "../services/api.js";

const DEFAULT_TIMERS = [15, 30, 45, 60];

export function useDashboard() {
  const [tasks, setTasks] = useState([]);
  const [dailyGoals, setDailyGoals] = useState([]);
  const [streak, setStreak] = useState(0);
  const [customTimers, setCustomTimers] = useState(DEFAULT_TIMERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const refreshGoals = useCallback(async () => {
    const { data } = await api.get("/goals/today");
    setDailyGoals(data.goals);
    setStreak(data.streak);
  }, []);

  const load = useCallback(async (signal) => {
    try {
      setIsLoading(true);
      setError(null);

      const [tasksRes, goalsRes, userRes] = await Promise.all([
        api.get("/tasks", { signal }),
        api.get("/goals/today", { signal }),
        api.get("auth/me", { signal }),
      ]);

      setTasks(tasksRes.data);
      setDailyGoals(goalsRes.data.goals);
      setStreak(goalsRes.data.streak);

      if (userRes.data?.settings?.focusTimers) {
        setCustomTimers(userRes.data.settings.focusTimers);
      }
    } catch (err) {
      if (err.name === "CanceledError") return;
      console.error(err);
      setError("Couldn't retrieve data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const addTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = async (taskId) => {
    try {
      setActionError(null);
      await api.patch(`/tasks/${taskId}/toggle`);

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      );

      await refreshGoals();
    } catch (err) {
      console.error(err);
      setActionError("Task status couldn't be saved.");
    }
  };

  const completeTimer = async (minutes) => {
    try {
      setActionError(null);
      await api.patch("/goals/focus", { minutes });

      await refreshGoals();
    } catch (err) {
      console.error(err);
      setActionError("There is a problem with saving your focus time.");
    }
  };

  return {
    tasks,
    dailyGoals,
    streak,
    customTimers,
    isLoading,
    error,
    actionError,
    refetch: () => load(),
    addTask,
    toggleTask,
    completeTimer,
  };
}
