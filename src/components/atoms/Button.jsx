import Icon from "./Icon";

/**
 * @param {string} children
 * @param {string} variant
 * @param {boolean} loading
 * @param {boolean} fullWidth
 * @param {string} icon
 * @param {string} className
 * @param {boolean} disabled
 */
function Button({
  children,
  variant = "primary",
  loading = false,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) {
  const baseStyles =
    "flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 shadow-lg shadow-green-500/20",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 px-5 py-2",
    outline: "border-2 border-gray-100/80 text-white hover:bg-white/10 px-5 py-2",
    ghost: "bg-transparent text-white hover:bg-white/5 px-5 py-2",
    icon: "bg-transparent text-white hover:text-green-500 p-2",
    link: "bg-transparent text-green-500 hover:text-green-400 p-0",
    google: "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-6 py-3 shadow-md",
  };

  const widthStyle = fullWidth ? "w-full" : "w-fit";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <Icon name={icon} className="text-xl" />}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
