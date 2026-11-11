export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export type DataSourceMode = 'mock' | 'live';

export interface ConversionResult {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number;
  invertedRate: number;
  convertedAmount: number;
  timestamp: Date;
  source: DataSourceMode;
}

export interface ExchangeRatesMap {
  [currencyCode: string]: number;
}
