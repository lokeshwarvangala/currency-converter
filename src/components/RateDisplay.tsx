import React from 'react';
import { ConversionResult } from '../types/currency';

interface RateDisplayProps {
  hasConverted: boolean;
  result: ConversionResult | null;
  loading: boolean;
  error: string | null;
}

export const RateDisplay: React.FC<RateDisplayProps> = ({
  hasConverted,
  result,
  loading,
  error,
}) => {
  // If the user hasn't clicked Convert Currency, or the inputs have been changed since last convert, keep hidden
  if (!hasConverted) {
    return null;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center transition-all animate-in fade-in duration-200">
        <p className="text-xs text-red-600 font-semibold mb-1">Conversion Error</p>
        <p className="text-xs text-red-500 leading-relaxed">{error}</p>
      </div>
    );
  }

  if (loading && !result) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50/70 border border-purple-100 rounded-2xl p-4 text-center transition-all animate-in fade-in duration-200">
        <p className="text-xs text-slate-500 font-medium mb-1">Exchange Rate</p>
        <div className="text-sm font-semibold text-purple-700 mb-1.5">Fetching live rate...</div>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">--</div>
      </div>
    );
  }

  if (!result) return null;

  const formattedConverted = result.convertedAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50/70 border border-purple-100 rounded-2xl p-4 text-center transition-all animate-in fade-in duration-200">
      <p className="text-xs text-slate-500 font-medium mb-1">Exchange Rate</p>
      <div id="unit-rate" className="text-sm font-semibold text-purple-700 mb-1.5">
        1 {result.fromCurrency} = {result.rate.toFixed(4)} {result.toCurrency}
      </div>
      <div id="total-result" className="text-2xl font-extrabold text-slate-900 tracking-tight">
        {formattedConverted} {result.toCurrency}
      </div>
    </div>
  );
};
