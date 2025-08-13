import React from 'react';

export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`bg-[#4d724d] text-white font-semibold px-6 py-2 rounded-xl shadow-sm transition-colors duration-200 hover:bg-[#8db48e] focus:outline-none focus:ring-2 focus:ring-[#8db48e] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}