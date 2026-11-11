import { useState, useCallback, useEffect } from 'react';
import { ConversionResult, DataSourceMode, Currency } from '../types/currency';
import { RateService } from '../services/rateService';
import { fetchSupportedCurrencyCodes } from '../services/apiRates';
import { CURRENCIES, getOrganizedCurrencies } from '../data/currencies';

export interface UseCurrencyConverterProps {
  initialAmount?: string | number;
  initialFrom?: string;
  initialTo?: string;
  initialMode?: DataSourceMode;
}

export function useCurrencyConverter({
  initialAmount = '100',
  initialFrom = 'USD',
  initialTo = 'EUR',
  initialMode = 'live',
}: UseCurrencyConverterProps = {}) {
  const [amount, setAmountState] = useState<string>(String(initialAmount));
  const [fromCurrency, setFromCurrencyState] = useState<string>(initialFrom);
  const [toCurrency, setToCurrencyState] = useState<string>(initialTo);
  const [mode, setMode] = useState<DataSourceMode>(initialMode);
  const [currencies, setCurrencies] = useState<Currency[]>(CURRENCIES);

  const [hasConverted, setHasConverted] = useState<boolean>(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // Background sync active currency codes from open.er-api.com
  useEffect(() => {
    let mounted = true;
    fetchSupportedCurrencyCodes().then((activeCodes) => {
      if (mounted && activeCodes && activeCodes.length > 0) {
        setCurrencies(getOrganizedCurrencies(activeCodes));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Invalidate any existing conversion result
  const invalidateResult = useCallback(() => {
    setHasConverted(false);
    setResult(null);
    setError(null);
  }, []);

  const handleAmountChange = (val: string) => {
    // Only allow positive numbers and at most one decimal point
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setAmountState(val);
      invalidateResult();
    }
  };

  const handleFromChange = (currencyCode: string) => {
    setFromCurrencyState(currencyCode);
    invalidateResult();
  };

  const handleToChange = (currencyCode: string) => {
    setToCurrencyState(currencyCode);
    invalidateResult();
  };

  const handleSwap = useCallback(() => {
    setIsSwapping(true);
    const newFrom = toCurrency;
    const newTo = fromCurrency;

    setFromCurrencyState(newFrom);
    setToCurrencyState(newTo);
    invalidateResult();

    setTimeout(() => {
      setIsSwapping(false);
    }, 300);
  }, [fromCurrency, toCurrency, invalidateResult]);

  const executeConvert = useCallback(
    async (
      targetAmount = amount,
      targetFrom = fromCurrency,
      targetTo = toCurrency,
      targetMode = mode
    ) => {
      setHasConverted(true);
      setLoading(true);
      setError(null);
      try {
        const parsedAmount = parseFloat(targetAmount) || 0;
        const res = await RateService.convert({
          amount: parsedAmount,
          fromCurrency: targetFrom,
          toCurrency: targetTo,
          mode: targetMode,
        });
        setResult(res);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Conversion error occurred');
      } finally {
        setLoading(false);
      }
    },
    [amount, fromCurrency, toCurrency, mode]
  );

  return {
    amount,
    setAmount: handleAmountChange,
    fromCurrency,
    setFromCurrency: handleFromChange,
    toCurrency,
    setToCurrency: handleToChange,
    currencies,
    mode,
    setMode,
    hasConverted,
    result,
    loading,
    error,
    isSwapping,
    handleSwap,
    executeConvert: (
      targetAmount?: string,
      targetFrom?: string,
      targetTo?: string,
      targetMode?: DataSourceMode
    ) => executeConvert(targetAmount, targetFrom, targetTo, targetMode),
  };
}
