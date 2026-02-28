import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

// Create socket with improved configuration
const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
  forceNew: false,
});

// Connection status tracking with callbacks
let isConnected = false;
let reconnectAttempts = 0;
const connectionCallbacks = [];

// Register a callback to be called when connection is established
export const onSocketConnected = (callback) => {
  if (isConnected) {
    callback();
  } else {
    connectionCallbacks.push(callback);
  }
};

// Process queued callbacks
const processConnectionCallbacks = () => {
  connectionCallbacks.forEach(cb => cb());
  connectionCallbacks.length = 0; // Clear callbacks
};

// Emit user online status when connected
socket.on("connect", () => {
  console.log("🔌 Socket connected:", socket.id);
  isConnected = true;
  reconnectAttempts = 0;
  
  // Process any pending connection callbacks
  processConnectionCallbacks();
  
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user._id) {
        socket.emit("user_online", user._id);
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }
});

// Handle disconnection
socket.on("disconnect", (reason) => {
  console.log("🔌 Socket disconnected:", reason);
  isConnected = false;
});

// Handle connection errors
socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
  reconnectAttempts++;
});

// Handle reconnection
socket.on("reconnect", (attemptNumber) => {
  console.log(`🔌 Socket reconnected after ${attemptNumber} attempts`);
  isConnected = true;
  
  // Process any pending connection callbacks
  processConnectionCallbacks();
  
  // Re-emit user online status
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user._id) {
        socket.emit("user_online", user._id);
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }
});

// Handle reconnection attempts
socket.on("reconnect_attempt", (attemptNumber) => {
  console.log(`🔄 Reconnection attempt ${attemptNumber}`);
  reconnectAttempts = attemptNumber;
});

// Handle reconnection failure
socket.on("reconnect_failed", () => {
  console.error("❌ Socket reconnection failed after all attempts");
});

// Listen for user status changes
socket.on("user_status_change", (data) => {
  console.log("User status changed:", data);
  // Emit custom event that components can listen to
  window.dispatchEvent(new CustomEvent("userStatusChange", { detail: data }));
});

// Listen for incoming messages for debugging
socket.on("receive_message", (data) => {
  console.log("📥 Received message:", data);
});

// Helper function to check connection status
export const isSocketConnected = () => isConnected;

// Helper function to get socket instance
export const getSocket = () => socket;

// Helper function to force reconnection
export const reconnectSocket = () => {
  if (!isConnected) {
    socket.connect();
  }
};

export default socket;
