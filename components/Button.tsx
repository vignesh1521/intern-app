"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  fullWidth = false,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const variants = {
    primary: "bg-black text-white hover:opacity-90",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        px-5 py-3 rounded-lg transition font-medium cursor-pointer
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? "w-full" : ""}
        ${variants[variant]}
        ${className}
      `}
    >
      {loading && (
        <div className="relative w-5 h-5">
          <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
          <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
        </div>
      )}

      <span
        className={`transition-all duration-300 ${
          loading ? "animate-pulse" : ""
        }`}
      >
        {loading ? "Please wait..." : children}
      </span>
    </button>
  );
} 