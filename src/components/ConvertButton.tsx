import React from 'react';

interface ConvertButtonProps {
  loading?: boolean;
}

export const ConvertButton: React.FC<ConvertButtonProps> = ({ loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 hover:from-purple-700 hover:via-indigo-700 hover:to-violet-800 text-white font-semibold text-base shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-75"
    >
      <span>{loading ? 'Converting...' : 'Convert Currency'}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  );
};
