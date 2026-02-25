import Icon from "./Icon";

/**
 * @param {Object} user
 * @param {string} size (sm, md, lg)
 * @param {Function} onClick
 */
const UserAvatar = ({ user, size = "md", onClick, className = "" }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-2xl",
  };

  // Create initials from user's name
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const initials = user?.displayName ? getInitials(user.displayName) : "U";

  return (
    <div
      onClick={onClick}
      className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-green-500 ${className}`}
    >
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName || "User"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white font-bold">
          {initials}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
