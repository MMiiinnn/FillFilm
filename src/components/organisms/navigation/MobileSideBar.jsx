import { Link, useNavigate } from "react-router-dom";
import Icon from "../../atoms/Icon";
import Button from "../../atoms/Button";
import useWatchlistStore from "../../../store/useWatchlistStore";
import useAuthStore from "../../../store/useAuthStore";
import UserAvatar from "../../atoms/UserAvatar";

const urlList = {
  "Home": "/",
  "Discover": "/search",
  "Movie Release": "/#upcoming",
  "About": "/about",
  "Watchlist": "/watchlist",
};

function MobileSideBar({ onOpen, onClose, links }) {
  const navigate = useNavigate();
  const { watchlist } = useWatchlistStore();
  const { user, signOut } = useAuthStore();

  const handleNavigation = (link) => {
    const path = urlList[link];
    if (path) {
      // Move to upcoming section if the link is "Movie Release"
        if (path.startsWith("/#")) {
            window.location.hash = path.split("#")[1];
        } else {
            navigate(path);
        }
    }
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {onOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-screen w-72 bg-zinc-950 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl border-l border-white/5 flex flex-col
          ${onOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
            <Icon name="close" className="text-2xl" />
          </button>
        </div>

        {/* User Profile Section (if authenticated) */}
        {user && (
          <div className="p-4 border-b border-white/10 bg-zinc-900/50">
            <div className="flex items-center gap-3 mb-3">
              <UserAvatar user={user} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-zinc-400 text-sm truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-center text-sm"
              onClick={() => {
                navigate("/profile");
                onClose();
              }}
            >
              View Profile
            </Button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link}>
                <button
                  className="w-full text-left px-6 py-4 text-lg text-zinc-300 hover:bg-white/5 hover:text-green-500 transition-all border-b border-white/5 flex items-center justify-between"
                  onClick={() => handleNavigation(link)}
                >
                  <span>{link}</span>
                  {link === "Watchlist" && watchlist.length > 0 && (
                    <span className="bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
                      {watchlist.length}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-white/10 flex flex-col gap-3 bg-zinc-900/50">
          {user ? (
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={handleSignOut}
            >
              <Icon name="logout" />
              Sign Out
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => {
                  navigate("/signup");
                  onClose();
                }}
              >
                Sign up
              </Button>
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={() => {
                  navigate("/signin");
                  onClose();
                }}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MobileSideBar;
