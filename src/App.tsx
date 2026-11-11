import React from 'react';
import { useCurrencyConverter } from './hooks/useCurrencyConverter';
import { CURRENCY_MAP } from './data/currencies';
import { CardHeader } from './components/CardHeader';
import { AmountInput } from './components/AmountInput';
import { CurrencySelect } from './components/CurrencySelect';
import { SwapButton } from './components/SwapButton';
import { RateDisplay } from './components/RateDisplay';
import { ConvertButton } from './components/ConvertButton';

export const App: React.FC = () => {
  const {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    currencies,
    hasConverted,
    result,
    loading,
    error,
    isSwapping,
    handleSwap,
    executeConvert,
  } = useCurrencyConverter({
    initialAmount: '100',
    initialFrom: 'USD',
    initialTo: 'EUR',
    initialMode: 'live',
  });

  const fromCurrencyMeta = CURRENCY_MAP[fromCurrency];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeConvert();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 text-slate-800 flex items-center justify-center p-4 antialiased">
      {/* Main Converter Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 transition-all duration-300">
        
        {/* Header */}
        <CardHeader />

        {/* Converter Form */}
        <form id="converter-form" className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Amount Input */}
          <AmountInput
            amount={amount}
            onChange={setAmount}
            currencySymbol={fromCurrencyMeta?.symbol || '$'}
          />

          {/* Currency Selectors with Swap Button */}
          <div className="space-y-3">
            <CurrencySelect
              id="from-select"
              label="From"
              value={fromCurrency}
              onChange={setFromCurrency}
              currencies={currencies}
            />

            <SwapButton onSwap={handleSwap} isSwapping={isSwapping} />

            <CurrencySelect
              id="to-select"
              label="To"
              value={toCurrency}
              onChange={setToCurrency}
              currencies={currencies}
            />
          </div>

          {/* Converted Result Card - Hidden until Convert Currency button is clicked */}
          <RateDisplay
            hasConverted={hasConverted}
            result={result}
            loading={loading}
            error={error}
          />

          {/* Convert Action Button */}
          <ConvertButton loading={loading} />

        </form>
      </div>
    </div>
  );
};

export default App;
