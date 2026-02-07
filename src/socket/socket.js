import { io } from "socket.io-client";

// Same origin as API: VITE_SOCKET_URL or derive from VITE_API_URL (e.g. https://api.example.com/api → https://api.example.com)
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const socketUrl = import.meta.env.VITE_SOCKET_URL || apiUrl.replace(/\/api\/?$/, "") || "http://localhost:5000";

/**
 * Socket instance – autoConnect: false so we connect only after login
 */
const socket = io(socketUrl, {
  autoConnect: false,
  transports: ["websocket"]
});

export default socket;
