import { Howl } from "howler";

// Default sound URL
const defaultSound = "https://www.fesliyanstudios.com/play-mp3/4383";

// Initialize notificationSound with the default sound (no localStorage access yet)
export let notificationSound = new Howl({
  src: [defaultSound],
  volume: 0.5,
});

// Function to get the saved sound from localStorage (client-side only)
const getSavedSound = () => {
  if (typeof window === "undefined") return defaultSound;
  return localStorage.getItem("notificationSound") || defaultSound;
};

// Function to play notification sound
export const playNotificationSound = () => {
  notificationSound.play();
};

// Function to update notification sound
export const updateNotificationSound = (newSound: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("notificationSound", newSound);
  }
  notificationSound = new Howl({ src: [newSound], volume: 0.5 });
};

// Initialize the sound on the client side after mount
if (typeof window !== "undefined") {
  const savedSound = getSavedSound();
  updateNotificationSound(savedSound);
}