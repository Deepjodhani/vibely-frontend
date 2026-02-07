import { useEffect, useState } from "react";
import { searchUsers } from "../../api/user.api";
import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const data = await searchUsers(query);
      setResults(data);
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Search users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#564172]"
      />

      {results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg border">
          {results.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user._id}`}
              className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100"
              onClick={() => setQuery("")}
            >
              <Avatar
                src={user.profilePic}
                name={user.username}
                size="sm"
              />
              <span className="text-sm">
                {user.username}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
