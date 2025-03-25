"use client";
import { useState, useEffect } from "react";

const FOCUS_TIME = 25 * 60; // 25 min
const SHORT_BREAK = 5 * 60; // 5 min
const LONG_BREAK = 15 * 60; // 15 min

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionSwitch();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleSessionSwitch = () => {
    if (sessionType === "focus") {
      setCycleCount((prev) => prev + 1);
      setSessionType(cycleCount % 4 === 0 ? "longBreak" : "shortBreak");
      setTimeLeft(cycleCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK);
    } else {
      setSessionType("focus");
      setTimeLeft(FOCUS_TIME);
    }
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-gray-900 text-white rounded-lg shadow-lg w-96">
      <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
      <p className="text-xl font-semibold">
        {sessionType === "focus" ? "Focus Session" : sessionType === "shortBreak" ? "Short Break" : "Long Break"}
      </p>
      <p className="text-5xl font-mono">{formatTime(timeLeft)}</p>
      <div className="flex space-x-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setSessionType("focus");
            setTimeLeft(FOCUS_TIME);
            setCycleCount(0);
          }}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Reset
        </button>
      </div>
      <p className="text-sm text-gray-400">Cycle: {cycleCount}</p>
    </div>
  );
};

export default PomodoroTimer;
