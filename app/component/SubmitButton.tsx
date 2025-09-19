import React from "react";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children?: React.ReactNode;
  className?: string; 
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        w-full py-3 rounded-xl font-semibold text-white shadow-lg 
        bg-gradient-to-r from-orange-500 to-red-500
        transition-transform
        ${isDisabled ? "cursor-not-allowed opacity-60" : "hover:scale-105"}
        ${className} 
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            />
          </svg>
          {children || "Loading..."}
        </span>
      ) : (
        children || "Submit"
      )}
    </button>
  );
};

export default SubmitButton;
