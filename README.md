# Pomodoro Timer Documentation

## Overview

The **Pomodoro Timer** is a productivity tool built with Next.js, React, TypeScript, and Tailwind CSS. It implements the Pomodoro Technique, a time management method that uses focused work sessions (typically 25 minutes) followed by short breaks (5 minutes) or long breaks (15 minutes) after a set number of sessions. The application includes a **Task Manager** to help users organize tasks, track the number of Pomodoro sessions spent on each task, and manage their workflow effectively.

### Key Features
- **Customizable Timer**: Set durations for focus sessions, short breaks, and long breaks.
- **Task Management**: Add, edit, complete, and delete tasks, with the ability to track Pomodoro sessions per task.
- **Session Tracking**: Automatically switch between focus, short break, and long break sessions, with a cycle counter to trigger long breaks after four focus sessions.
- **Notification Sounds**: Choose from multiple notification sounds to alert when a session ends.
- **Persistent Storage**: Timer settings and tasks are saved in `localStorage` to persist across page reloads.
- **Responsive Design**: A modern, dark-themed UI with glassmorphism effects, animations, and a custom scrollbar, optimized for desktop use.

### Tech Stack
- **Framework**: Next.js (React framework for server-side rendering and static site generation)
- **Language**: TypeScript (for type safety and better developer experience)
- **Styling**: Tailwind CSS (utility-first CSS framework for rapid UI development)
- **Animations**: Framer Motion (for smooth task addition/removal animations)
- **Storage**: `localStorage` (for persisting timer settings and tasks)

---

## Setup Instructions

### Prerequisites
- **Node.js**: Version 14.x or higher (includes `npm`).
- **Git**: For cloning the repository (optional if you download the code manually).

### Installation
1. **Clone the Repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**:
   Run the following command to install all required packages:
   ```bash
   npm install
   ```
   This will install Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and other dependencies listed in `package.json`.

3. **Add Notification Sound Files**:
   - The application uses audio files for session-end notifications. Create a `public/sounds` directory in your project root.
   - Add the following sound files (or your own):
     - `Alarm1.wav`
     - `Alarm2.wav`
     - `Alarm3.wav`
     - `Alarm4.wav`
   - These files should be accessible at `/sounds/Alarm1.wav`, `/sounds/Alarm2.wav`, etc.

4. **Add the `useSound` Hook**:
   - Create a file `app/hooks/useSound.ts` with the following content to handle notification sounds:
     ```tsx
     let audio: HTMLAudioElement | null = null;

     export const updateNotificationSound = (soundUrl: string) => {
       if (typeof window !== "undefined") {
         audio = new Audio(soundUrl);
         localStorage.setItem("notificationSound", soundUrl);
       }
     };

     export const playNotificationSound = () => {
       if (audio) {
         audio.play().catch((error) => {
           console.error("Error playing sound:", error);
         });
       }
     };
     ```
   - This hook manages the audio playback for session-end notifications.

5. **Start the Development Server**:
   Run the following command to start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` to see the application.

### Deployment (Optional)
To deploy the application on Vercel:
1. Push your code to a GitHub repository.
2. Sign up for a Vercel account and import your repository.
3. Vercel will automatically detect the Next.js project and deploy it. Ensure the sound files are included in the `public/sounds` directory in your repository.

---

## Usage Guide

### Getting Started
1. **Open the Application**:
   - Access the app at `http://localhost:3000` (or your deployed URL).
   - You’ll see the Pomodoro Timer interface with a timer display, session controls, and a task manager section.

2. **Set Up the Timer**:
   - The default settings are:
     - Focus: 25 minutes
     - Short Break: 5 minutes
     - Long Break: 15 minutes
   - Adjust these durations using the input fields under the timer (e.g., change "Focus" to 20 minutes by entering `20`).

3. **Add Tasks**:
   - In the "Task Manager" section, enter a task name (e.g., "Write report") in the input field.
   - Click the "Add Task" button to add the task to the list.

4. **Select a Task**:
   - Each task has a radio button on the left. Click the radio button to select a task for the current Pomodoro session.
   - The selected task will be highlighted with a blue background, and its Pomodoro count will increment when a focus session ends.

5. **Start a Session**:
   - Click the "Start" button to begin a focus session.
   - The timer will count down from the set duration (e.g., 25 minutes for a focus session).
   - You can pause the timer by clicking "Pause" and resume by clicking "Start" again.

6. **Session Transitions**:
   - When a focus session ends, the app will play a notification sound and automatically switch to a short break (or a long break after four focus sessions).
   - After a break ends, the app switches back to a focus session.

7. **Manage Tasks**:
   - **Complete a Task**: Click the "Done" button to mark a task as complete. The task name will get a strikethrough, and the button will change to "Undo". Click "Undo" to mark it as incomplete.
   - **Edit a Task**: Click the "Edit" button to rename a task. A prompt will appear where you can enter the new name.
   - **Delete a Task**: Click the "Delete" button to remove a task from the list.
   - **Clear Completed Tasks**: If there are completed tasks, a "Clear" button will appear at the top-right of the task list. Click it to remove all completed tasks.

8. **Customize Notification Sound**:
   - Use the "Notification Sound" dropdown to select a sound (e.g., "Alarm 1", "Alarm 2").
   - The selected sound will play when a session ends.

9. **Reset the Timer**:
   - Click the "Reset" button to stop the timer, reset the session to "Focus", and set the cycle count to 0.

### Example Workflow
1. Add tasks: "Write report", "Study for exam", "Email client".
2. Select "Write report" by clicking its radio button.
3. Start a 25-minute focus session. Work on the report without distractions.
4. When the session ends, take a 5-minute short break.
5. After four focus sessions, take a 15-minute long break.
6. Mark "Write report" as complete by clicking "Done".
7. Edit "Study for exam" to "Review math notes" by clicking "Edit".
8. Delete "Email client" if it’s no longer needed by clicking "Delete".

---

## Feature Descriptions

### Timer Controls
- **Session Types**:
  - **Focus**: A work session (default: 25 minutes).
  - **Short Break**: A brief rest period (default: 5 minutes).
  - **Long Break**: A longer rest period after four focus sessions (default: 15 minutes).
  - Switch between session types manually by clicking the corresponding button ("Focus", "Short Break", "Long Break").
- **Start/Pause**: Start or pause the timer.
- **Reset**: Reset the timer to the initial focus duration and clear the cycle count.
- **Progress Bar**: A visual indicator of the remaining time in the current session.

### Custom Time Inputs
- Adjust the duration of each session type by entering a value in minutes.
- Input validation ensures values are greater than 0. Errors are displayed in red below the input field.

### Task Manager
- **Add Task**: Enter a task name and click "Add Task" to add it to the list.
- **Select Task**: Use the radio button to select a task for the current Pomodoro session. The selected task’s Pomodoro count increments when a focus session ends.
- **Complete Task**: Click "Done" to mark a task as complete (strikethrough applied). Click "Undo" to revert.
- **Edit Task**: Click "Edit" to rename a task via a prompt.
- **Delete Task**: Click "Delete" to remove a task.
- **Clear Completed**: Remove all completed tasks with the "Clear" button.
- **Pomodoro Tracking**: Each task displays the number of Pomodoro sessions completed for it (e.g., "2 Pomodoros").

### Notification Sounds
- Choose from four predefined sounds to play when a session ends.
- The selected sound is saved in `localStorage` and persists across sessions.

### Persistent Storage
- Timer settings (focus, short break, long break durations) and the current session state (time left, session type, cycle count) are saved in `localStorage`.
- Tasks (including their completion status and Pomodoro counts) are also saved in `localStorage`.

### UI Design
- **Dark Theme**: A gradient background (`from-gray-900 to-gray-800`) with white text for readability.
- **Glassmorphism**: Task items use a semi-transparent background (`bg-gray-800/50`) with a blur effect (`backdrop-blur-sm`).
- **Animations**: Tasks fade in and out when added or removed using Framer Motion.
- **Custom Scrollbar**: The task list has a styled scrollbar to match the dark theme.
- **Tooltips**: Hover over the radio button, "Complete", "Edit", "Delete", and "Clear" buttons to see tooltips explaining their purpose.


### Project Structure
- **`app/components/PomodoroTimer.tsx`**: The main timer component, handling session logic, state management, and UI rendering.
- **`app/components/TaskManager.tsx`**: The task management component, handling task CRUD operations and Pomodoro tracking.
- **`app/hooks/useSound.ts`**: A custom hook for managing notification sound playback.
- **`app/globals.css`**: Global styles, including Tailwind CSS setup and custom scrollbar styling.
- **`public/sounds/`**: Directory for notification sound files.


3. **Add Task Categories**:
   - Add a `category` field to the `Task` interface.
   - Include a dropdown to filter tasks by category.
4. **Mobile Responsiveness**:
   - Adjust Tailwind CSS classes to make the UI responsive for smaller screens (e.g., reduce font sizes, stack elements vertically).

### Known Limitations
- **Task Editing UX**: The `prompt` for editing tasks is basic. Consider replacing it with a more user-friendly solution.
- **Sound Playback**: Audio playback may fail in some browsers due to autoplay restrictions. Users must interact with the page first.
- **Mobile Support**: The UI is optimized for desktop. Additional styling is needed for mobile devices.


## Conclusion

The Pomodoro Timer is a powerful tool for boosting productivity through focused work sessions and effective task management. By following the usage guide, users can customize their workflow, track their progress, and stay organized. Developers can extend the project by adding new features, improving the UI, or optimizing for mobile use.

If you encounter any issues or have suggestions for improvements, feel free to contribute to the project or reach out for support.
