import { useState, useEffect } from "react";
import api from "../services/api";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
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

  const deleteTask = async (taskId) => {
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

  const updateTask = async (taskId, editData) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, editData);

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === taskId ? { ...t, ...editData } : t)),
        );
        return true;
      }

      return false;
    } catch (err) {
      console.log(err);
      setError("Could not update task.");
      return false;
    }
  };

  const moveToToday = async (taskId) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/move-to-today`);

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === taskId ? response.data : t)),
        );
      }
    } catch (err) {
      console.log(err);
      setError("Could not move the task for today.");
    }
  };

  return { tasks, isLoading, error, deleteTask, updateTask, moveToToday };
}
