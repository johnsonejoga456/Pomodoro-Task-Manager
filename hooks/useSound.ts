import { Howl } from "howler";

// Default sound URL
const defaultSound = "/sounds/Alarm1.wav"; // Ensure this path is correct

// Declare the notificationSound variable as potentially undefined
let notificationSound: Howl | undefined;
let currentSound: string = defaultSound; // Track the current sound

const initializeNotificationSound = (initialSound: string) => {
  notificationSound = new Howl({
    src: [initialSound],
  });
};

// Function to get the saved sound from localStorage (client-side only)
const getSavedSound = () => {
  if (typeof window === "undefined") return defaultSound;
  return localStorage.getItem("notificationSound") || defaultSound;
};

// Function to play notification sound
export const playNotificationSound = () => {
  if (notificationSound) { // Check if notificationSound is initialized
    notificationSound.play();
  }
};

// Function to update notification sound
export const updateNotificationSound = (newSound: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("notificationSound", newSound);
  }
  
  // Initialize only if the sound has changed
  if (currentSound !== newSound) {
    currentSound = newSound; // Update the current sound tracker
    initializeNotificationSound(newSound); // Initialize the sound
  }
};

// Initialize the sound on the client side after mount
if (typeof window !== "undefined") {
  const savedSound = getSavedSound();
  initializeNotificationSound(savedSound);
}

// Optional: Listen for errors
if (notificationSound) { // Check if notificationSound is initialized before adding the error listener
  notificationSound.on('loaderror', (id, error) => {
    console.error('Failed to load sound:', error);
  });
}