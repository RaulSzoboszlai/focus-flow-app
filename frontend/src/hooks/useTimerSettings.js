import { useState, useEffect } from "react";
import api from "../services/api";

const DEFAULT_TIMERS = [15, 30, 45, 60];

export function useTimerSettings() {
  const [timers, setTimers] = useState(DEFAULT_TIMERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const controller = new AbortController();

    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/auth/me", {
          signal: controller.signal,
        });

        if (data?.settings?.focusTimers) {
          setTimers(data.settings.focusTimers);
        }
      } catch (err) {
        if (err.name === "CanceledError") return;
        console.error(err);
        setMessage({ type: "error", text: "Couldn't load your settings." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
    return () => controller.abort();
  }, []);

  const updateTimer = (index, value) => {
    setTimers((prev) => prev.map((t, i) => (i === index ? Number(value) : t)));
  };

  const saveTimers = async () => {
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const { data } = await api.patch("/auth/settings/timers", { timers });
      setTimers(data);
      setMessage({ type: "success", text: "The settings were saved" });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "There is a saving problem",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { timers, isLoading, isSaving, message, updateTimer, saveTimers };
}
