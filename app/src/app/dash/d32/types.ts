export type Period = "1D" | "1W" | "1M" | "1Y";

export type AssetId =
  | "portfolio"
  | "btc"
  | "eth"
  | "sol"
  | "usdc"
  | "link"
  | "avax"
  | "doge"
  | "pol"
  | "uni"
  | "arb";

export interface AssetMeta {
  id: Exclude<AssetId, "portfolio">;
  symbol: string;
  name: string;
  color: string;
  decimals: number;
}

export interface Holding extends AssetMeta {
  price: number;
  qty: number;
  change24h: number;
  changeWeek: number;
  changeMonth: number;
  changeYear: number;
}

export interface WatchAsset extends AssetMeta {
  price: number;
  change24h: number;
  changeWeek: number;
  changeMonth: number;
  changeYear: number;
}

export interface MarketStats {
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  supply: number;
}

export type TransactionType = "buy" | "sell" | "transfer_in" | "transfer_out";

export interface Transaction {
  id: string;
  type: TransactionType;
  assetId: Exclude<AssetId, "portfolio">;
  symbol: string;
  qty: number;
  value: number;
  date: string;
  time: string;
  status: "completed" | "pending";
}

export interface SeriesPoint {
  /** short axis label */
  label: string;
  /** full label used in crosshair tooltip */
  full: string;
  value: number;
}
