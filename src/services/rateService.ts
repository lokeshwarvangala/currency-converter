import { ConversionResult, DataSourceMode } from '../types/currency';
import { getMockRate } from './mockRates';
import { fetchLiveRate } from './apiRates';

export interface ConvertOptions {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  mode?: DataSourceMode;
}

export class RateService {
  /**
   * Returns the single unit exchange rate (1 From = X To).
   */
  static async getRate(
    fromCurrency: string,
    toCurrency: string,
    mode: DataSourceMode = 'live'
  ): Promise<{ rate: number; actualMode: DataSourceMode }> {
    if (fromCurrency === toCurrency) {
      return { rate: 1.0, actualMode: mode };
    }

    if (mode === 'live') {
      const liveRate = await fetchLiveRate(fromCurrency, toCurrency);
      return { rate: liveRate, actualMode: 'live' };
    }

    // Explicit mock mode
    const mockRate = getMockRate(fromCurrency, toCurrency);
    return { rate: mockRate, actualMode: 'mock' };
  }

  /**
   * Converts the specified amount and returns formatted details.
   */
  static async convert({
    amount,
    fromCurrency,
    toCurrency,
    mode = 'live',
  }: ConvertOptions): Promise<ConversionResult> {
    const safeAmount = isNaN(amount) || amount < 0 ? 0 : amount;
    const { rate, actualMode } = await this.getRate(fromCurrency, toCurrency, mode);

    const convertedAmount = safeAmount * rate;
    const invertedRate = rate !== 0 ? 1 / rate : 0;

    return {
      fromCurrency,
      toCurrency,
      amount: safeAmount,
      rate,
      invertedRate,
      convertedAmount,
      timestamp: new Date(),
      source: actualMode,
    };
  }
}
