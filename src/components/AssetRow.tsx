import { View } from "react-native";
import { Text } from "react-native-paper";

import type { PortfolioAsset } from "../types/portfolio";
import { palette } from "../theme";

type Props = {
  asset: PortfolioAsset;
  total: number;
  hidden?: boolean;
  last?: boolean;
};

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);

const quantity = (value: number, symbol: string) => {
  const precision = symbol === "USDT" ? 2 : 6;
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: precision }).format(value)} ${symbol}`;
};

export function AssetRow({ asset, total, hidden = false, last = false }: Props) {
  const positive = asset.changePercent24h >= 0;
  const share = total === 0 ? 0 : Math.round((asset.valueUsd / total) * 100);

  return (
    <View>
      <View className="flex-row items-center py-4">
        <View className="mr-3 h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: `${asset.color}1C`, borderWidth: 1, borderColor: `${asset.color}46` }}>
          <Text style={{ color: asset.color, fontSize: 15, fontFamily: "Geist_700Bold" }}>{asset.symbol === "USDT" ? "₮" : asset.symbol === "BNB" ? "B" : asset.symbol === "BTC" ? "₿" : "◆"}</Text>
        </View>
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center gap-2">
            <Text numberOfLines={1} style={{ color: palette.text, fontSize: 14, fontFamily: "Geist_600SemiBold", flexShrink: 1 }}>{asset.name}</Text>
            <Text style={{ color: palette.quiet, fontSize: 10, fontFamily: "Geist_600SemiBold", letterSpacing: 0.4 }}>{asset.symbol}</Text>
          </View>
          <Text numberOfLines={1} style={{ color: palette.quiet, fontSize: 11, fontFamily: "Geist_400Regular", marginTop: 3 }}>
            {quantity(asset.quantity, asset.symbol)} · {share}% da carteira
          </Text>
        </View>
        <View className="items-end pl-2">
          <Text style={{ color: palette.text, fontSize: 13, fontFamily: "Geist_600SemiBold", fontVariant: ["tabular-nums"] }}>{hidden ? "••••••" : money(asset.valueUsd)}</Text>
          <Text style={{ color: positive ? palette.positive : palette.danger, fontSize: 11, fontFamily: "Geist_500Medium", marginTop: 3 }}>
            {hidden ? "•••" : `${positive ? "+" : ""}${asset.changePercent24h.toFixed(2)}%`}
          </Text>
        </View>
      </View>
      {!last && <View className="ml-14 h-px" style={{ backgroundColor: palette.hairline }} />}
    </View>
  );
}
