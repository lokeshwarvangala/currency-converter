/**
 * Real-time Exchange Rate Service
 * Endpoint: https://open.er-api.com/v6/latest/{base}
 * - No API key required
 * - Free to use & CORS enabled for direct browser calls
 * - 24-hour localStorage caching with strict error fallback
 */

const CACHE_PREFIX = 'currency_rates_';
const CODES_CACHE_KEY = 'supported_currency_codes';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CURRENCY_CODE_REGEX = /^[A-Z]{3,4}$/;

function sanitizeCurrencyCode(code: string): string {
  const clean = code.trim().toUpperCase();
  if (!CURRENCY_CODE_REGEX.test(clean)) {
    throw new Error(`Invalid currency code: ${code}`);
  }
  return encodeURIComponent(clean);
}

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
}

interface CachedCodes {
  codes: string[];
  timestamp: number;
}

interface OpenErApiResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
}

function getFromStorage(currencyCode: string): CachedRates | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${currencyCode}`);
    if (!raw) return null;
    return JSON.parse(raw) as CachedRates;
  } catch {
    return null;
  }
}

function saveToStorage(currencyCode: string, rates: Record<string, number>): void {
  try {
    const data: CachedRates = {
      rates,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${currencyCode}`, JSON.stringify(data));
  } catch {
    // localStorage might be unavailable in private browsing quota limits; ignore safely
  }
}

/**
 * Fetches the list of active supported currency codes from open.er-api.com
 * with 24-hour localStorage caching.
 */
export async function fetchSupportedCurrencyCodes(): Promise<string[]> {
  const now = Date.now();
  try {
    const raw = localStorage.getItem(CODES_CACHE_KEY);
    if (raw) {
      const parsed: CachedCodes = JSON.parse(raw);
      if (now - parsed.timestamp < CACHE_TTL_MS && parsed.codes.length > 0) {
        return parsed.codes;
      }
    }
  } catch {
    // Ignore cache read errors
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data: OpenErApiResponse = await response.json();
      if (data.result === 'success' && data.rates) {
        const codes = Object.keys(data.rates);
        // Save to cache
        try {
          const cachePayload: CachedCodes = { codes, timestamp: now };
          localStorage.setItem(CODES_CACHE_KEY, JSON.stringify(cachePayload));
        } catch {
          // Ignore storage quota
        }
        return codes;
      }
    }
  } catch {
    // Background fetch failure fallback
  }

  // Fallback to existing cached codes if any
  try {
    const raw = localStorage.getItem(CODES_CACHE_KEY);
    if (raw) {
      const parsed: CachedCodes = JSON.parse(raw);
      if (parsed.codes && parsed.codes.length > 0) return parsed.codes;
    }
  } catch {
    // ignore
  }

  return [];
}

/**
 * Fetches the real-time exchange rate between two currencies.
 * Uses 24-hour localStorage cache, refreshes from open.er-api.com,
 * and falls back to expired local cache before throwing a strict error.
 */
export async function fetchLiveRate(fromCode: string, toCode: string): Promise<number> {
  const cleanFrom = sanitizeCurrencyCode(fromCode);
  const cleanTo = sanitizeCurrencyCode(toCode);

  if (cleanFrom === cleanTo) return 1.0;

  const now = Date.now();
  const cached = getFromStorage(cleanFrom);

  // If cache is valid within 24 hours, return immediately
  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    const rate = cached.rates[cleanTo];
    if (rate !== undefined) {
      return rate;
    }
  }

  // Try fetching fresh rates from open.er-api.com
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

    const response = await fetch(`https://open.er-api.com/v6/latest/${cleanFrom}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: OpenErApiResponse = await response.json();
    if (data.result === 'success' && data.rates) {
      saveToStorage(cleanFrom, data.rates);
      const rate = data.rates[cleanTo];
      if (rate !== undefined) {
        return rate;
      }
      throw new Error(`Currency ${cleanTo} not available in market data.`);
    }

    throw new Error('Unexpected response format from exchange rate provider.');
  } catch (err: unknown) {
    // If network or API fails, check if we have any cached data (even if older than 24h)
    if (cached && cached.rates[cleanTo] !== undefined) {
      return cached.rates[cleanTo];
    }

    // Strict Error fallback when no cached data exists
    const errorDetails = err instanceof Error ? err.message : 'Network unreachable';
    throw new Error(
      `Unable to fetch live exchange rates (${errorDetails}). Please check your internet connection.`
    );
  }
}
