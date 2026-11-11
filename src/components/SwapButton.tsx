import React from 'react';

interface SwapButtonProps {
  onSwap: () => void;
  isSwapping: boolean;
}

export const SwapButton: React.FC<SwapButtonProps> = ({ onSwap, isSwapping }) => {
  return (
    <div className="relative flex items-center justify-center my-1">
      <div className="border-t border-slate-100 w-full absolute" />
      <button
        type="button"
        id="swap-btn"
        onClick={onSwap}
        title="Swap currencies"
        className="relative z-10 w-10 h-10 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-600 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <svg
          id="swap-icon"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-transform duration-300 ${isSwapping ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </button>
    </div>
  );
};
