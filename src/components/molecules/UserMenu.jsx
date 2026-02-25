import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../atoms/UserAvatar";
import Icon from "../atoms/Icon";
import useAuthStore from "../../store/useAuthStore";

/**
 * User menu dropdown for authenticated users
 */
const UserMenu = () => {
  const { user, signOut } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        <UserAvatar user={user} size="md" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 sm:w-64 max-w-[calc(100vw-2rem)] bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <UserAvatar user={user} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-zinc-400 text-sm truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Icon name="person" className="text-xl" />
              <span>Profile</span>
            </Link>

            <Link
              to="/watchlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Icon name="bookmark" className="text-xl" />
              <span>My Watchlist</span>
            </Link>
          </div>

          {/* Sign Out */}
          <div className="border-t border-zinc-800 py-2">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors w-full"
            >
              <Icon name="logout" className="text-xl" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
