import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import authService from "../../services/authService";
import UserAvatar from "../atoms/UserAvatar";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import useWatchlistStore from "../../store/useWatchlistStore";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { watchlist } = useWatchlistStore();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateUserProfile(displayName);
      setIsEditing(false);
    } catch (error) {
      // Error handled 
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <Icon name="arrow_back" className="text-xl" />
            Back to Home
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black text-white">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <UserAvatar user={user} size="lg" />

            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      loading={loading}
                      fullWidth={false}
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(user.displayName || "");
                      }}
                      fullWidth={false}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      {user.displayName || "User"}
                    </h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-zinc-400 hover:text-green-500 transition-colors"
                    >
                      <Icon name="edit" className="text-xl" />
                    </button>
                  </div>
                  <p className="text-zinc-400 mb-4">{user.email}</p>

                  {/* Account Info */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <p className="text-zinc-500 text-sm mb-1">
                        Watchlist Items
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {watchlist.length}
                      </p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <p className="text-zinc-500 text-sm mb-1">
                        Account Type
                      </p>
                      <p className="text-2xl font-bold text-green-500">Free</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/watchlist"
            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-xl p-6 hover:border-green-500 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Icon name="bookmark" className="text-2xl text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">My Watchlist</h3>
                <p className="text-zinc-400 text-sm">
                  {watchlist.length} movies saved
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/"
            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-xl p-6 hover:border-green-500 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Icon name="explore" className="text-2xl text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Discover Movies
                </h3>
                <p className="text-zinc-400 text-sm">
                  Browse trending and popular
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
