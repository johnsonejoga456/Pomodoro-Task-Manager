"use client";
import React, { useState, useEffect } from "react";
import { playNotificationSound, updateNotificationSound } from "@/hooks/useSound";

const PomodoroTimer = () => {
  // Default values for initial state (used during SSR)
  const defaultFocusTime = 25 * 60;
  const defaultShortBreakTime = 5 * 60;
  const defaultLongBreakTime = 15 * 60;
  const defaultSound = "https://www.fesliyanstudios.com/play-mp3/4383";

  // Initialize state without accessing localStorage directly
  const [focusTime, setFocusTime] = useState<number>(defaultFocusTime);
  const [shortBreakTime, setShortBreakTime] = useState<number>(defaultShortBreakTime);
  const [longBreakTime, setLongBreakTime] = useState<number>(defaultLongBreakTime);
  const [timeLeft, setTimeLeft] = useState<number>(defaultFocusTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [selectedSound, setSelectedSound] = useState<string>(defaultSound);

  // Local state for input values while typing
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({
    focusTime: (defaultFocusTime / 60).toString(),
    shortBreakTime: (defaultShortBreakTime / 60).toString(),
    longBreakTime: (defaultLongBreakTime / 60).toString(),
  });

  // State for input validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    focusTime: "",
    shortBreakTime: "",
    longBreakTime: "",
  });

  // List of available notification sounds (URLs)
  const soundOptions = [
    { name: "Default", url: "https://www.fesliyanstudios.com/play-mp3/4383" },
    { name: "Bell", url: "https://www.fesliyanstudios.com/play-mp3/387" },
    { name: "Chime", url: "https://www.fesliyanstudios.com/play-mp3/7030" },
  ];

  // Function to get saved time from localStorage (client-side only)
  const getSavedTime = (key: string, defaultValue: number): number => {
    if (typeof window === "undefined") return defaultValue;
    const savedValue = parseInt(localStorage.getItem(key) || String(defaultValue), 10);
    return isNaN(savedValue) ? defaultValue : savedValue;
  };

  // Function to get saved session type from localStorage (client-side only)
  const getSavedSessionType = (): "focus" | "shortBreak" | "longBreak" => {
    if (typeof window === "undefined") return "focus";
    return (localStorage.getItem("sessionType") as "focus" | "shortBreak" | "longBreak") || "focus";
  };

  // Function to get saved sound from localStorage (client-side only)
  const getSavedSound = (): string => {
    if (typeof window === "undefined") return defaultSound;
    return localStorage.getItem("notificationSound") || defaultSound;
  };

  // Initialize state from localStorage after mounting on the client
  useEffect(() => {
    // Update state with values from localStorage
    const savedFocusTime = getSavedTime("focusTime", defaultFocusTime);
    const savedShortBreakTime = getSavedTime("shortBreakTime", defaultShortBreakTime);
    const savedLongBreakTime = getSavedTime("longBreakTime", defaultLongBreakTime);

    setFocusTime(savedFocusTime);
    setShortBreakTime(savedShortBreakTime);
    setLongBreakTime(savedLongBreakTime);
    setTimeLeft(getSavedTime("timeLeft", savedFocusTime));
    setCycleCount(getSavedTime("cycleCount", 0));
    setSessionType(getSavedSessionType());
    setSelectedSound(getSavedSound());

    // Update input values to reflect saved times
    setInputValues({
      focusTime: (savedFocusTime / 60).toString(),
      shortBreakTime: (savedShortBreakTime / 60).toString(),
      longBreakTime: (savedLongBreakTime / 60).toString(),
    });

    // Update notification sound
    updateNotificationSound(getSavedSound());
  }, []); // Empty dependency array to run only once on mount

  // Update notification sound when selectedSound changes
  useEffect(() => {
    updateNotificationSound(selectedSound);
  }, [selectedSound]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      handleSessionSwitch();
    }

    // Save state in localStorage (client-side only)
    if (typeof window !== "undefined") {
      localStorage.setItem("timeLeft", String(isNaN(timeLeft) ? focusTime : timeLeft));
      localStorage.setItem("cycleCount", String(cycleCount));
      localStorage.setItem("sessionType", sessionType);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, cycleCount, sessionType, focusTime, shortBreakTime, longBreakTime]);

  const handleSessionSwitch = () => {
    // Play notification sound when a session ends
    playNotificationSound();

    if (sessionType === "focus") {
      setCycleCount((prev) => {
        const newCount = prev + 1;
        setSessionType(newCount % 4 === 0 ? "longBreak" : "shortBreak");
        setTimeLeft(newCount % 4 === 0 ? longBreakTime : shortBreakTime);
        return newCount;
      });
    } else {
      setSessionType("focus");
      setTimeLeft(focusTime);
    }
    setIsRunning(false);
  };

  const formatTime = (seconds: number): string => {
    const validSeconds = isNaN(seconds) || seconds < 0 ? 0 : seconds; // Fallback for invalid values
    const minutes = Math.floor(validSeconds / 60);
    const secs = validSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (type: "focusTime" | "shortBreakTime" | "longBreakTime", value: string) => {
    // Allow the input to be cleared or updated while typing
    setInputValues((prev) => ({
      ...prev,
      [type]: value,
    }));
    // Clear any existing error when the user starts typing
    setErrors((prev) => ({
      ...prev,
      [type]: "",
    }));
  };

  const handleTimeChange = (type: "focusTime" | "shortBreakTime" | "longBreakTime") => {
    const value = parseInt(inputValues[type], 10);
    const newTime = value * 60;

    // Validate input: reject 0, negative numbers, or empty input
    if (isNaN(newTime) || newTime <= 0) {
      setErrors((prev) => ({
        ...prev,
        [type]: "Value must be greater than 0",
      }));
      // Reset the input value to the current timer state
      setInputValues((prev) => ({
        ...prev,
        [type]:
          type === "focusTime"
            ? (focusTime / 60).toString()
            : type === "shortBreakTime"
            ? (shortBreakTime / 60).toString()
            : (longBreakTime / 60).toString(),
      }));
      return;
    }

    // Clear error if input is valid
    setErrors((prev) => ({
      ...prev,
      [type]: "",
    }));

    // Update localStorage and state
    if (typeof window !== "undefined") {
      localStorage.setItem(type, String(newTime));
    }

    if (type === "focusTime") {
      setFocusTime(newTime);
      if (sessionType === "focus") setTimeLeft(newTime);
    } else if (type === "shortBreakTime") {
      setShortBreakTime(newTime);
      if (sessionType === "shortBreak") setTimeLeft(newTime);
    } else {
      setLongBreakTime(newTime);
      if (sessionType === "longBreak") setTimeLeft(newTime);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-lg w-[400px] border border-gray-700">
      <h1 className="text-3xl font-bold tracking-wider">Pomodoro Timer</h1>

      {/* Session Selector */}
      <div className="flex space-x-2">
        {["focus", "shortBreak", "longBreak"].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              sessionType === type
                ? "bg-blue-500 shadow-lg transform scale-105"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => {
              setSessionType(type as "focus" | "shortBreak" | "longBreak");
              setTimeLeft(
                type === "focus"
                  ? focusTime
                  : type === "shortBreak"
                  ? shortBreakTime
                  : longBreakTime
              );
              setIsRunning(false);
            }}
          >
            {type === "focus" ? "Focus" : type === "shortBreak" ? "Short Break" : "Long Break"}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative flex items-center justify-center">
        <p className="text-6xl font-mono font-semibold tracking-wider">
          {formatTime(timeLeft)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 h-3 rounded-lg overflow-hidden">
        <div
          className="h-3 bg-blue-400 rounded-lg transition-all"
          style={{
            width: `${
              (timeLeft /
                (sessionType === "focus"
                  ? focusTime
                  : sessionType === "shortBreak"
                  ? shortBreakTime
                  : longBreakTime)) *
              100
            }%`,
          }}
        ></div>
      </div>

      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setSessionType("focus");
            setTimeLeft(focusTime);
            setCycleCount(0);
          }}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
        >
          Reset
        </button>
      </div>

      {/* Custom Time Inputs */}
      <div className="grid grid-cols-3 gap-4 w-full text-center">
        {[
          { label: "Focus", value: inputValues.focusTime, type: "focusTime" },
          { label: "Short Break", value: inputValues.shortBreakTime, type: "shortBreakTime" },
          { label: "Long Break", value: inputValues.longBreakTime, type: "longBreakTime" },
        ].map(({ label, value, type }) => (
          <div key={type} className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300">{label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) =>
                handleInputChange(type as "focusTime" | "shortBreakTime" | "longBreakTime", e.target.value)
              }
              onBlur={() => handleTimeChange(type as "focusTime" | "shortBreakTime" | "longBreakTime")}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleTimeChange(type as "focusTime" | "shortBreakTime" | "longBreakTime");
                }
              }}
              className={`bg-gray-800 p-2 rounded-md text-white border ${
                errors[type] ? "border-red-500" : "border-gray-600"
              } w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
              min="1" // Prevent negative numbers in the input
            />
            {errors[type] && (
              <p className="text-red-500 text-xs mt-1">{errors[type]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Sound Selection */}
      <div className="w-full flex flex-col items-center">
        <label className="text-sm text-gray-300 mb-1">Notification Sound</label>
        <select
          value={selectedSound}
          onChange={(e) => setSelectedSound(e.target.value)}
          className="bg-gray-800 px-4 py-2 rounded-md text-white border border-gray-600 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-700 transition-all duration-300"
        >
          {soundOptions.map((option) => (
            <option key={option.url} value={option.url}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PomodoroTimer;