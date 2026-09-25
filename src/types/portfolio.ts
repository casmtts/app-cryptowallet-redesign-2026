export type PortfolioAsset = {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  priceUsd: number;
  valueUsd: number;
  changePercent24h: number;
  color: string;
  icon: string;
};

export type Portfolio = {
  currency: "USD";
  totalBalanceUsd: number;
  periodChangeUsd: number;
  periodChangePercent: number;
  period: string;
  assets: PortfolioAsset[];
};
