import React from 'react';

interface AmountInputProps {
  amount: string;
  onChange: (val: string) => void;
  currencySymbol: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  onChange,
  currencySymbol,
}) => {
  return (
    <div>
      <label
        htmlFor="amount-input"
        className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
      >
        Amount to Convert
      </label>
      <div className="relative rounded-2xl shadow-sm">
        <span
          className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-semibold text-lg"
          id="amount-symbol"
        >
          {currencySymbol}
        </span>
        <input
          type="number"
          id="amount-input"
          value={amount}
          min="0"
          step="any"
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          placeholder="0.00"
          required
        />
      </div>
    </div>
  );
};
