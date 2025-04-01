"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define the Task type
interface Task {
  id: number;
  name: string;
  completed: boolean;
  pomodoros: number;
}

// Define the props for TaskManager
interface TaskManagerProps {
  onSelectTask: (taskId: number | null) => void;
  selectedTask: number | null;
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
    if (newTask.trim() === "") return;
    const newTaskObj: Task = {
      id: Date.now(),
      name: newTask,
      completed: false,
      pomodoros: 0,
    };
    setTasks((prev) => [...prev, newTaskObj]);
    setNewTask("");
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
      onSelectTask(null);
    }
  };

  const editTask = (id: number, currentName: string) => {
    const newName = prompt("Edit task name:", currentName);
    if (newName && newName.trim()) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, name: newName.trim() } : task
        )
      );
    }
  };

  const clearCompletedTasks = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
    if (selectedTask && tasks.find((task) => task.id === selectedTask)?.completed) {
      onSelectTask(null);
    }
  };

  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="w-full flex flex-col items-center space-y-6 mt-8">
      {/* Heading, Stats, and Clear Completed */}
      <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
          Task Manager
        </h2>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-400">
            {completedTasks}/{totalTasks} Completed
          </div>
          {completedTasks > 0 && (
            <button
              onClick={clearCompletedTasks}
              className="flex items-center space-x-1 px-4 py-2 bg-red-500/80 hover:bg-red-600/90 text-white rounded-lg border border-red-400/50 transition-all duration-300 hover:scale-105"
              title="Clear Completed Tasks"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Task Input */}
      <div className="flex w-full space-x-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg text-white border border-gray-600/50 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
        />
        <button
          onClick={addTask}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="w-full max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4 italic">
            No tasks yet. Add one to get started!
          </p>
        ) : (
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                  task.id === selectedTask
                    ? "bg-blue-600/80 border border-blue-500 shadow-lg"
                    : "bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/70"
                } backdrop-blur-sm`}
              >
                <div className="flex items-center space-x-4">
                  {/* Radio button to select the task */}
                  <div className="relative group">
                    <input
                      type="radio"
                      checked={task.id === selectedTask}
                      onChange={() => onSelectTask(task.id)}
                      className="text-blue-500 focus:ring-blue-500 h-5 w-5 border-gray-600 cursor-pointer"
                    />
                    <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Select for Pomodoro
                    </span>
                  </div>
                  <span
                    className={`text-lg ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-200"
                    } truncate max-w-[180px]`}
                  >
                    {task.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-sm font-medium">
                    {task.pomodoros} Pomodoros
                  </span>
                  {/* Complete Button */}
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-300 relative group ${
                      task.completed
                        ? "bg-green-600/80 hover:bg-green-700/90 text-white"
                        : "bg-gray-600/50 hover:bg-gray-500/70 text-gray-300"
                    }`}
                    title={task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">
                      {task.completed ? "Undo" : "Done"}
                    </span>
                    <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                    </span>
                  </button>
                  {/* Edit Button */}
                  <button
                    onClick={() => editTask(task.id, task.name)}
                    className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/80 hover:bg-yellow-600/90 text-white rounded-md transition-all duration-300 relative group"
                    title="Edit Task"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8a2 2 0 01-2-2v-2.414a2 2 0 01.586-1.414l5.828-5.828z"
                      />
                    </svg>
                    <span className="text-sm">Edit</span>
                    <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Edit Task
                    </span>
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex items-center space-x-1 px-2 py-1 bg-red-500/80 hover:bg-red-600/90 text-white rounded-md transition-all duration-300 relative group"
                    title="Delete Task"
                  >
                    <svg
                      className="w-4 h-4"
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
                    <span className="text-sm">Delete</span>
                    <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Delete Task
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TaskManager;