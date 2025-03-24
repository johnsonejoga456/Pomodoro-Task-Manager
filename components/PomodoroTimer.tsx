"use client";

import { useState, useEffect } from "react";

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      alert("Time's up! Take a break. ☕");
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
      <p className="text-6xl my-4">{formatTime(timeLeft)}</p>
      <div className="flex space-x-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="bg-green-500 px-6 py-2 rounded-md text-white font-semibold"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => { setTimeLeft(25 * 60); setIsRunning(false); }}
          className="bg-red-500 px-6 py-2 rounded-md text-white font-semibold"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
