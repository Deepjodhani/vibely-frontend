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
        <div className="flex flex-col gap-3 py-3 md:flex-row md:h-16 md:items-center md:justify-between md:gap-4 md:py-0">
          
          {/* -------- Row 1: Brand (order-1) -------- */}
          <Link
            to="/feed"
            className="order-1 text-2xl font-semibold tracking-tight text-[#564172] italic"
            style={{ fontFamily: 'cursive, "Brush Script MT", "Lucida Handwriting", "Comic Sans MS", serif' }}
          >
            Vibely
          </Link>

          {/* -------- Search: full width on mobile (order-3), center on desktop (order-2) -------- */}
          <div className="order-3 w-full min-w-0 flex-1 md:order-2 md:max-w-md">
            <UserSearch />
          </div>

          {/* -------- Right: Actions (order-2 on mobile, order-3 on desktop) -------- */}
          <div className="order-2 flex items-center gap-3 md:order-3">
            <NotificationBell />
            <Link to={`/profile/${user._id}`}>
              <Avatar
                name={user.username}
                src={user.profilePic}
              />
            </Link>
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
