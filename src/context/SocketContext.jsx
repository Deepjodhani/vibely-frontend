import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import socket from "../socket/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const activeUserId = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    /* ---------------- LOGOUT / RESET ---------------- */
    if (!user?._id) {
      if (socket.connected) {
        socket.disconnect();
        console.log("🔌 Socket disconnected on logout");
      }

      activeUserId.current = null;
      setNotifications([]);
      return;
    }

    /* ---------------- CONNECT (ONCE PER USER) ---------------- */
    if (activeUserId.current !== user._id) {
      if (!socket.connected) {
        socket.connect();
        console.log("🔌 Socket connected");
      }

      socket.emit("join", user._id);
      activeUserId.current = user._id;

      console.log("👤 Socket joined room for:", user._id);
    }

    /* ---------------- LISTENER ---------------- */
    const handleNotification = (notification) => {
      console.log("🔔 Notification received:", notification);

      setNotifications((prev) => {
        // prevent accidental duplicates
        if (prev.some((n) => n._id === notification._id)) {
          return prev;
        }
        return [notification, ...prev];
      });
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [user?._id]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider
      value={{ socket, notifications, clearNotifications }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
