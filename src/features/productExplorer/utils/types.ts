export interface DataPoint {
  month: string; // Expected format 'MMM DD'
  value: number;
}

export interface Token {
  address: string;
  chain: string;
}
export interface PoolJoinExitsResponse {
  poolGetJoinExits: PoolJoinExit[];
}

export interface PoolSnapshots {
  poolId: string;
  amounts: string[];
  fees24h: string;
  timestamp: number;
  chain: string;
}
export interface PricePoint {
  timestamp: number;
  price: number;
}
export interface CoinPrices {
  prices: PricePoint[];
}
export interface PriceData {
  coins: Record<string, CoinPrices>;
}
export type PoolSnapshotsData = Record<string, PoolSnapshots[]>;

export const TWELVE_HOURS_IN_SECONDS = 12 * 3600;
export interface MergedData {
  poolID: string;
  chain: string;
  hodl: number[];
  fees24h: string[];
  weightedPrice: number[];
  txData: PoolJoinExit[];
}
export interface Amount {
  address: string;
  amount: string;
}

export interface PoolJoinExit {
  chain: string;
  id: string;
  sender: string;
  timestamp: number;
  tx: string;
  valueUSD: string;
  type: string;
  amounts: Amount[];
  poolId: string;
}
