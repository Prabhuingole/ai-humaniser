import React from 'react';

export default function WordLimitedTextbox({
  value,
  onChange,
  wordLimit,
  errorMessage = 'Word limit exceeded!',
  placeholder = '',
}) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const overLimit = wordCount > wordLimit;

  return (
    <div className="flex flex-col items-center w-full">
      <textarea
        className={`w-full min-h-[240px] p-7 text-xl rounded-2xl border transition-colors duration-200 font-sans shadow-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#8db48e] focus:border-[#8db48e] ${
          overLimit
            ? 'border-red-400 bg-[#f5f5f5]'
            : 'border-[#4d724d] bg-[#f5f5f5]'
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ resize: 'vertical' }}
      />
      <div className="flex justify-between items-center mb-2 w-full">
        <span className={`text-sm ${overLimit ? 'text-red-500' : 'text-[#4d724d]'}`}>{
          wordCount
        }/{wordLimit} words</span>
        {overLimit && (
          <span className="text-xs text-red-500 ml-2">{errorMessage}</span>
        )}
      </div>
    </div>
  );
} 