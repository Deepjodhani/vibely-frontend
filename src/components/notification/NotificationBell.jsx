import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useSocket } from "../../context/SocketContext";

const NotificationBell = () => {
  const { notifications, clearNotifications } = useSocket();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const unreadCount = notifications.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      {/* 🔔 Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative rounded-full p-2 transition hover:bg-slate-100"
      >
        <Bell className="h-5 w-5 text-slate-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[18px]
                           items-center justify-center rounded-full
                           bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📩 Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 z-50 mt-2 w-[calc(100vw-2rem)] max-w-sm overflow-hidden
                     rounded-xl border bg-white shadow-xl sm:w-80"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-2">
            <span className="text-sm font-semibold text-slate-700">
              Notifications
            </span>

            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs font-medium text-purple-600 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Body */}
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500">
              No notifications yet
            </p>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto divide-y sm:max-h-80">
              {notifications.map((n, index) => (
                <div
                  key={n._id || index}
                  className="flex gap-3 px-4 py-3 text-sm hover:bg-slate-50"
                >
                  {/* Avatar / Initial */}
                  <div className="flex h-8 w-8 shrink-0 items-center
                                  justify-center rounded-full bg-purple-100
                                  text-xs font-semibold text-purple-700">
                    {n.sender?.username?.[0]?.toUpperCase() || "U"}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-slate-700">
                      <span className="font-medium text-slate-900">
                        {n.sender?.username || "Someone"}
                      </span>{" "}
                      {n.message}
                    </p>

                    {n.createdAt && (
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
