import { ExchangeRatesMap } from '../types/currency';

/**
 * Realistic baseline exchange rates pegged against 1 USD base.
 * Cross-rate calculation formula:
 *   Rate(From -> To) = Rate(USD -> To) / Rate(USD -> From)
 */
export const MOCK_EXCHANGE_RATES: ExchangeRatesMap = {
  USD: 1.0,
  EUR: 0.9245,
  GBP: 0.7892,
  INR: 83.525,
  JPY: 154.68,
  CAD: 1.3654,
  AUD: 1.5182,
  CHF: 0.9085,
  CNY: 7.2365,
  SGD: 1.3522,
  NZD: 1.6480,
  HKD: 7.8210,
  SEK: 10.584,
  KRW: 1374.50,
  BRL: 5.1520,
  MXN: 16.785,
  AED: 3.6725,
  SAR: 3.7505,
  ZAR: 18.420,
  NOK: 10.655,
  DKK: 6.8970,
  PLN: 3.9620,
  THB: 36.650,
  IDR: 16120.0,
  TRY: 32.250,
  MYR: 4.7150,
  PHP: 57.850,
  ILS: 3.7250,
  EGP: 47.950,
  TWD: 32.450,
  VND: 25420.0,
  PKR: 278.25
};

/**
 * Calculates the exchange rate between any two supported currencies from the mock database.
 */
export function getMockRate(fromCode: string, toCode: string): number {
  if (fromCode === toCode) return 1.0;

  const rateFrom = MOCK_EXCHANGE_RATES[fromCode];
  const rateTo = MOCK_EXCHANGE_RATES[toCode];

  if (!rateFrom || !rateTo) {
    throw new Error(`Unsupported currency pair: ${fromCode} to ${toCode}`);
  }

  return rateTo / rateFrom;
}
