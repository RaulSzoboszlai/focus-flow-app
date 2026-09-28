import { useEffect, useState } from "react";
import PageLayout from "../components/shared/PageLayout";
import ErrorMessage from "../components/shared/ErrorMessage";
import LoadingState from "../components/shared/LoadingState";
import api from "../services/api";

function TimerPage() {
  const [timers, setTimers] = useState([15, 30, 45, 60]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleTimerChange = (index, value) => {
    const newTimers = [...timers];
    newTimers[index] = Number(value);
    setTimers(newTimers);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.patch("/auth/settings/timers", { timers });

      if (res.status === 200) {
        setMessage({ type: "success", text: "The settings were saved" });
        setTimers(res.data);
      }
    } catch (err) {
      console.log(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "There is a saving problem",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout
      title={"Timer Settings"}
      subtitle={"Customize your timer widget."}
    >
      {isLoading ? (
        <LoadingState message={"Loading timers..."} />
      ) : (
        <div className="max-w-3xl">
          <ErrorMessage type={message.type} message={message.text} />

          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
            <form onSubmit={handleSave}>
              <div className="p-6 border-b border-slate-100 bg-white">
                <h2 className="text-base font-semibold text-slate-800">
                  Focus Timer
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Select 4 timers which match your preference for focus time.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {timers.map((time, index) => (
                  <div
                    key={index}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-indigo-400"></div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          Option {index + 1}
                        </h3>
                        <div className="flex gap-3 mt-1 text-xs text-slate-500 font-medium">
                          <span>Duration in minutes</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={time}
                        onChange={(e) =>
                          handleTimerChange(index, e.target.value)
                        }
                        className="w-20 text-sm p-2 text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                        required
                      />
                      <span className="text-sm text-slate-500 font-medium">
                        min
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 sm:p-5 bg-slate-50/50 flex justify-end border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default TimerPage;
