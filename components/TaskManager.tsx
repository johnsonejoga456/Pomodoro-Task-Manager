"use client";
import React, { useState, useEffect } from "react";

// Define the Task type
interface Task {
  id: number;
  name: string;
  completed: boolean;
  pomodoros: number; // Number of Pomodoro sessions completed for this task
}

// Define the props for TaskManager
interface TaskManagerProps {
  onSelectTask: (taskId: number | null) => void; // Callback to select a task
  selectedTask: number | null; // ID of the currently selected task
}

const TaskManager: React.FC<TaskManagerProps> = ({ onSelectTask, selectedTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  // Function to get saved tasks from localStorage (client-side only)
  const getSavedTasks = (): Task[] => {
    if (typeof window === "undefined") return [];
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  };

  // Initialize tasks from localStorage after mounting on the client
  useEffect(() => {
    setTasks(getSavedTasks());
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Task Manager Functions
  const addTask = () => {
    if (newTask.trim() === "") return; // Prevent adding empty tasks
    const newTaskObj: Task = {
      id: Date.now(), // Use timestamp as a unique ID
      name: newTask,
      completed: false,
      pomodoros: 0,
    };
    setTasks((prev) => [...prev, newTaskObj]);
    setNewTask(""); // Clear the input field
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (selectedTask === id) {
      onSelectTask(null); // Deselect the task if it’s deleted
    }
  };

  const incrementPomodoro = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, pomodoros: task.pomodoros + 1 } : task
      )
    );
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 mt-6">
      <h2 className="text-xl font-semibold text-gray-200">Task Manager</h2>

      {/* Add Task Input */}
      <div className="flex w-full space-x-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="bg-gray-800 p-2 rounded-md text-white border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <div className="w-full max-h-48 overflow-y-auto space-y-2">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-center">No tasks added yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ${
                task.id === selectedTask
                  ? "bg-blue-600 border border-blue-500"
                  : "bg-gray-800 border border-gray-600"
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Radio button to select the task */}
                <input
                  type="radio"
                  checked={task.id === selectedTask}
                  onChange={() => onSelectTask(task.id)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                {/* Checkbox to mark task as completed */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className="text-green-500 focus:ring-green-500"
                />
                <span
                  className={`${
                    task.completed ? "line-through text-gray-400" : "text-white"
                  }`}
                >
                  {task.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">
                  {task.pomodoros} Pomodoros
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-600 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;