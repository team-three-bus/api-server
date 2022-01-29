export type InqueryCondition = {
  BRAND: string[]
  ORDER: 'lowPrice' | 'highPrice' | 'popularity' | 'viewCnt';
  event: string[]
};

export type OrderType = {
  key: string,
  condition: 'ASC' | 'DESC'
};