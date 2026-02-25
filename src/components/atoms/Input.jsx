import { forwardRef, useState } from "react";
import Icon from "./Icon";

/**
 * @param {string} id - Input ID
 * @param {string} type 
 * @param {string} label
 * @param {string} placeholder 
 * @param {string} value 
 * @param {Function} onChange 
 * @param {string} error 
 * @param {boolean} required
 * @param {string} className 
 * @param {string} containerClassName
 * @param {boolean} showPasswordToggle 
 * @param {boolean} showEmailValidation 
 */
const Input = forwardRef(({ 
  id, 
  type = "text",
  label, 
  placeholder,
  value,
  onChange,
  className = "", 
  containerClassName = "",
  error,
  required = false,
  showPasswordToggle = true,
  showEmailValidation = true,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = type === "password" && showPassword ? "text" : type;
  
  const shouldShowPasswordToggle = type === "password" && showPasswordToggle;
  
  const shouldShowEmailValidation = type === "email" && showEmailValidation && value && !error;

  return (
    <div className={`flex flex-col gap-1 w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-zinc-400 text-sm font-medium ml-1">
          {label}
        </label>
      )}
      
      <div className="relative w-full">
        <input
          ref={ref}
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300 placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          } ${
            shouldShowPasswordToggle || shouldShowEmailValidation ? 'pr-10' : ''
          } ${className}`}
          {...props}
        />
        
        {shouldShowPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            tabIndex={-1}
          >
            <Icon name={showPassword ? "visibility_off" : "visibility"} />
          </button>
        )}
        
        {shouldShowEmailValidation && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <Icon name="check_circle" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-xs ml-1 flex items-center gap-1">
          <Icon name="error" className="text-base" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
