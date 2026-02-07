import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../../api/user.api";
import Avatar from "../ui/Avatar";

const UserSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const data = await searchUsers(query);
      setResults(data);
      setOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (userId) => {
    setQuery("");
    setResults([]);
    setOpen(false);
    navigate(`/profile/${userId}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Search users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#564172]"
      />

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg border overflow-hidden">
          {results.map((user) => (
            <button
              key={user._id}
              type="button"
              onClick={() => handleSelectUser(user._id)}
              className="flex w-full items-center gap-3 px-4 py-2 hover:bg-slate-100 text-left cursor-pointer border-none bg-transparent"
            >
              <Avatar
                src={user.profilePic}
                name={user.username}
                size="sm"
              />
              <span className="text-sm text-slate-800">
                {user.username}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
