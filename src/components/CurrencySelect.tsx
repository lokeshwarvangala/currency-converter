import React from 'react';
import { Currency } from '../types/currency';

interface CurrencySelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (currencyCode: string) => void;
  currencies: Currency[];
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({
  id,
  label,
  value,
  onChange,
  currencies,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-10 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all cursor-pointer"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.flag} {curr.code} - {curr.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
