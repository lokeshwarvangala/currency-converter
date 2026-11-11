import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMockRate, MOCK_EXCHANGE_RATES } from '../mockRates';
import { RateService } from '../rateService';
import { fetchLiveRate, fetchSupportedCurrencyCodes } from '../apiRates';
import { getOrganizedCurrencies, POPULAR_CURRENCY_CODES, ALL_CURRENCIES } from '../../data/currencies';

describe('Mock Rates Engine', () => {
  it('should return 1.0 when converting to the same currency', () => {
    expect(getMockRate('USD', 'USD')).toBe(1.0);
    expect(getMockRate('EUR', 'EUR')).toBe(1.0);
    expect(getMockRate('INR', 'INR')).toBe(1.0);
  });

  it('should correctly calculate direct conversions against USD base', () => {
    expect(getMockRate('USD', 'EUR')).toBeCloseTo(MOCK_EXCHANGE_RATES.EUR, 4);
    expect(getMockRate('USD', 'INR')).toBeCloseTo(MOCK_EXCHANGE_RATES.INR, 4);
    expect(getMockRate('USD', 'GBP')).toBeCloseTo(MOCK_EXCHANGE_RATES.GBP, 4);
  });

  it('should correctly calculate cross-currency conversions', () => {
    const expectedRate = MOCK_EXCHANGE_RATES.GBP / MOCK_EXCHANGE_RATES.EUR;
    expect(getMockRate('EUR', 'GBP')).toBeCloseTo(expectedRate, 4);
    expect(getMockRate('GBP', 'EUR')).toBeCloseTo(1 / expectedRate, 4);
  });

  it('should throw an error for unsupported currencies', () => {
    expect(() => getMockRate('XYZ', 'USD')).toThrow('Unsupported currency pair');
    expect(() => getMockRate('USD', 'ABC')).toThrow('Unsupported currency pair');
  });
});

describe('RateService Conversion', () => {
  it('should calculate conversion correctly for positive amounts in mock mode', async () => {
    const result = await RateService.convert({
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      mode: 'mock',
    });

    expect(result.fromCurrency).toBe('USD');
    expect(result.toCurrency).toBe('EUR');
    expect(result.amount).toBe(100);
    expect(result.rate).toBeCloseTo(MOCK_EXCHANGE_RATES.EUR, 4);
    expect(result.convertedAmount).toBeCloseTo(100 * MOCK_EXCHANGE_RATES.EUR, 4);
    expect(result.invertedRate).toBeCloseTo(1 / MOCK_EXCHANGE_RATES.EUR, 4);
    expect(result.source).toBe('mock');
  });

  it('should handle zero amounts gracefully', async () => {
    const result = await RateService.convert({
      amount: 0,
      fromCurrency: 'USD',
      toCurrency: 'JPY',
      mode: 'mock',
    });

    expect(result.amount).toBe(0);
    expect(result.convertedAmount).toBe(0);
  });

  it('should treat negative amounts safely by defaulting to 0', async () => {
    const result = await RateService.convert({
      amount: -50,
      fromCurrency: 'USD',
      toCurrency: 'INR',
      mode: 'mock',
    });

    expect(result.amount).toBe(0);
    expect(result.convertedAmount).toBe(0);
  });

  it('should return rate 1.0 when from and to are the same in live mode', async () => {
    const result = await RateService.convert({
      amount: 150,
      fromCurrency: 'EUR',
      toCurrency: 'EUR',
      mode: 'live',
    });

    expect(result.rate).toBe(1.0);
    expect(result.convertedAmount).toBe(150);
  });
});

describe('Live Rates & LocalStorage Cache', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      clear: () => {
        for (const k in store) delete store[k];
      },
    });
  });

  it('should use fresh cached rates from localStorage without network fetch', async () => {
    const cacheData = {
      rates: { EUR: 0.95 },
      timestamp: Date.now(),
    };
    localStorage.setItem('currency_rates_USD', JSON.stringify(cacheData));

    const rate = await fetchLiveRate('USD', 'EUR');
    expect(rate).toBe(0.95);
  });

  it('should use expired cached rates if network fetch fails', async () => {
    const cacheData = {
      rates: { JPY: 150.0 },
      timestamp: Date.now() - 48 * 60 * 60 * 1000,
    };
    localStorage.setItem('currency_rates_USD', JSON.stringify(cacheData));

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch')));

    const rate = await fetchLiveRate('USD', 'JPY');
    expect(rate).toBe(150.0);
  });

  it('should throw an error when invalid currency code formats are provided', async () => {
    await expect(fetchLiveRate('../USD', 'EUR')).rejects.toThrow('Invalid currency code');
    await expect(fetchLiveRate('USD', 'TOOLONG')).rejects.toThrow('Invalid currency code');
    await expect(fetchLiveRate('123', 'EUR')).rejects.toThrow('Invalid currency code');
  });

  it('should throw a strict error when network fails and no cached data exists', async () => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network offline')));

    await expect(fetchLiveRate('USD', 'GBP')).rejects.toThrow(
      'Unable to fetch live exchange rates'
    );
  });

  it('should cache and retrieve supported currency codes', async () => {
    const mockCodes = ['USD', 'EUR', 'GBP', 'CAD'];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          result: 'success',
          rates: { USD: 1, EUR: 0.92, GBP: 0.78, CAD: 1.36 },
        }),
      })
    );

    const codes = await fetchSupportedCurrencyCodes();
    expect(codes).toEqual(mockCodes);
  });
});

describe('Currencies Organization', () => {
  it('should place popular currencies at the top of the list', () => {
    const organized = getOrganizedCurrencies();
    const firstTenCodes = organized.slice(0, 10).map((c) => c.code);

    expect(firstTenCodes).toEqual(POPULAR_CURRENCY_CODES);
    expect(organized.length).toBe(ALL_CURRENCIES.length);
  });

  it('should filter currencies when activeCodes are supplied', () => {
    const active = ['USD', 'EUR', 'BRL'];
    const filtered = getOrganizedCurrencies(active);

    expect(filtered.map((c) => c.code)).toEqual(['USD', 'EUR', 'BRL']);
  });
});
