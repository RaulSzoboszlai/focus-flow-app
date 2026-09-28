import { useState, useEffect } from "react";

function FocusTimerWidget({
  onTimerComplete,
  timerOptions = [15, 30, 45, 60],
}) {
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
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
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col items-center h-full min-h-0 min-w-0 overflow-hidden">
      <h3 className="font-bold text-lg text-slate-900 mb-3 self-start shrink-0">
        Focus Timer
      </h3>
 
      <div className="shrink-0 w-full flex justify-center">
        {!isActive && timeLeft === totalSeconds ? (
          <div className="flex flex-wrap justify-center gap-1.5 max-w-full bg-slate-50 p-1 rounded-xl border border-slate-100">
            {timerOptions.map((min) => (
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
          <div className="min-h-9 flex items-center">
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
              Session of {selectedMinutes} minutes
            </span>
          </div>
        )}
      </div>
 
      <div className="flex-1 min-h-[5.5rem] w-full flex items-center justify-center my-3">
        <div className="relative h-full max-h-40 max-w-full aspect-square flex items-center justify-center">
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
 
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase leading-none mb-1">
              Focus
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight leading-none">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>
 
      <div className="flex gap-3 w-full max-w-[200px] shrink-0">
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
            className="flex items-center justify-center w-10 h-10 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer shrink-0"
            title="Reset"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default FocusTimerWidget;
