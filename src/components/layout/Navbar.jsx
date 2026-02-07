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
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 overflow-visible">
        {/* Mobile: grid Row1 = Logo | Actions, Row2 = full-width Search. Desktop: single flex row */}
        <div className="grid grid-cols-[1fr_auto] gap-y-3 gap-x-4 py-3 md:flex md:h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:py-0 overflow-visible">
          {/* Logo */}
          <Link
            to="/feed"
            className="order-1 self-center text-xl font-semibold tracking-tight text-[#564172] italic sm:text-2xl"
            style={{ fontFamily: 'cursive, "Brush Script MT", "Lucida Handwriting", "Comic Sans MS", serif' }}
          >
            Vibely
          </Link>

          {/* Actions: right on mobile (order-2) and desktop (order-3) */}
          <div className="order-2 flex items-center justify-end gap-2 md:order-3 md:gap-3">
            <NotificationBell />
            <Link to={`/profile/${user._id}`} className="shrink-0">
              <Avatar
                name={user.username}
                src={user.profilePic}
              />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-slate-600 hover:text-slate-900 sm:inline-flex"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 sm:hidden"
              aria-label="Logout"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          {/* Search: full width row on mobile (order-3), center on desktop (order-2) */}
          <div className="order-3 col-span-2 min-w-0 md:order-2 md:col-span-1 md:max-w-md md:flex-1">
            <UserSearch />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
