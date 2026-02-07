import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import UserSearch from "../search/UserSearch";
import NotificationBell from "../notification/NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* -------- Left: Brand -------- */}
          <Link
            to="/feed"
            className="text-2xl font-semibold tracking-tight text-[#564172] italic"
            style={{ fontFamily: 'cursive, "Brush Script MT", "Lucida Handwriting", "Comic Sans MS", serif' }}
          >
            Vibely
          </Link>

          {/* -------- Center: Search (hide on small screens) -------- */}
          <div className="hidden md:block flex-1 max-w-md">
            <UserSearch />
          </div>

          {/* -------- Right: Actions -------- */}
          <div className="flex items-center gap-3">
            
            {/* 🔔 Notifications */}
            <NotificationBell />

            {/* 👤 Avatar (safe access) */}
            <Link to={`/profile/${user._id}`}>
              <Avatar
                name={user.username}
                src={user.profilePic}
              />
            </Link>

            {/* 🚪 Logout */}
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
