import { useState, useEffect } from "react";

function FocusTimerWidget({ onTimerComplete }) {
  const TIME_OPTIONS = [15, 30, 45, 60];

  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const [timeLeft, setTimeLeft] = useState(selectedMinutes);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setTimeLeft(selectedMinutes * 60);
  }, [selectedMinutes]);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);

      if (onTimerComplete) {
        onTimerComplete(selectedMinutes);
      }

      alert("Session done. Take a break!");
      setTimeLeft(selectedMinutes * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, selectedMinutes, onTimerComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedMinutes * 60);
  };

  const totalSeconds = selectedMinutes * 60;
  const strokeDashoffset =
    440 - (440 * (totalSeconds - timeLeft)) / totalSeconds;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col items-center justify-center h-full min-h-[360px]">
      <h3 className="font-bold text-lg text-slate-900 mb-4 self-start">
        Focus Timer
      </h3>

      {!isActive && timeLeft === totalSeconds ? (
        <div className="flex gap-2 mb-6 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {TIME_OPTIONS.map((min) => (
            <button
              key={min}
              onClick={() => setSelectedMinutes(min)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                selectedMinutes === min
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              {min}m
            </button>
          ))}
        </div>
      ) : (
        <div className="h-9 mb-6 flex items-center">
          <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
            Session of {selectedMinutes} minutes
          </span>
        </div>
      )}

      <div className="relative flex items-center justify-center w-40 h-40 mb-6">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 160 160"
        >
          <circle
            cx="80"
            cy="80"
            r="70"
            className="stroke-slate-100 fill-none"
            strokeWidth="8"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            className="stroke-indigo-600 fill-none transition-all duration-1000 ease-linear"
            strokeWidth="8"
            strokeDasharray="440"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-0.5">
            Focus
          </span>
          <span className="text-3xl font-bold text-slate-800 tracking-tight">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-[200px]">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-2.5 px-4 font-semibold text-sm rounded-xl shadow-sm transition cursor-pointer text-center ${
            isActive
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {isActive ? "Pause" : "Start"}
        </button>

        {timeLeft !== totalSeconds && (
          <button
            onClick={resetTimer}
            className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer"
            title="Reset"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default FocusTimerWidget;
