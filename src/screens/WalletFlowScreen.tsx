import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Alert, Pressable, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Surface, Text } from "react-native-paper";

import { AssetRow } from "../components/AssetRow";
import { BalanceChart, type BalanceRange } from "../components/BalanceChart";
import type { Portfolio, PortfolioAsset } from "../types/portfolio";
import { palette } from "../theme";

export type WalletFlow = "deposit" | "send" | "swap" | "analytics";
export type WalletNetwork = "Ethereum" | "Bitcoin";

type Props = {
  flow: WalletFlow;
  portfolio: Portfolio;
  network: WalletNetwork;
  onNetworkChange: (network: WalletNetwork) => void;
  onBack: () => void;
};

const flowCopy: Record<WalletFlow, { eyebrow: string; title: string; description: string; icon: string }> = {
  deposit: { eyebrow: "DEPÓSITO", title: "Receber cripto", description: "Escolha uma rede para ver os detalhes de recebimento.", icon: "arrow-down-left" },
  send: { eyebrow: "ENVIAR", title: "Enviar cripto", description: "Prepare uma transferência para revisar antes de enviar.", icon: "arrow-top-right" },
  swap: { eyebrow: "TROCA", title: "Trocar ativos", description: "Simule uma conversão entre os ativos da carteira.", icon: "swap-horizontal" },
  analytics: { eyebrow: "ANÁLISES", title: "Visão do portfólio", description: "Acompanhe a distribuição e a variação dos seus ativos.", icon: "chart-box-outline" },
};

const formatUsd = (amount: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(amount);

function FlowHeader({ flow, onBack }: { flow: WalletFlow; onBack: () => void }) {
  const copy = flowCopy[flow];

  return (
    <View className="mb-6">
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Voltar ao portfólio" className="mb-5 h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
        <MaterialCommunityIcons name="arrow-left" size={20} color={palette.text} />
      </Pressable>
      <View className="mb-3 flex-row items-center gap-2">
        <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: palette.accent }} />
        <Text style={{ color: palette.accent, fontFamily: "Geist_600SemiBold", fontSize: 10, letterSpacing: 1.4 }}>{copy.eyebrow}</Text>
      </View>
      <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 27, lineHeight: 34, letterSpacing: -0.8 }}>{copy.title}</Text>
      <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 13, lineHeight: 20, marginTop: 6 }}>{copy.description}</Text>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <Text style={{ color: palette.quiet, fontFamily: "Geist_600SemiBold", fontSize: 10, letterSpacing: 1.05, marginBottom: 9 }}>{children}</Text>;
}

function DemoNotice({ children = "Prévia demonstrativa. Nenhuma transação será enviada." }: { children?: ReactNode }) {
  return (
    <View className="mt-4 flex-row items-start gap-2 rounded-2xl px-3.5 py-3" style={{ backgroundColor: palette.accentSoft, borderColor: palette.accentBorder, borderWidth: 1 }}>
      <MaterialCommunityIcons name="information-outline" size={16} color={palette.accent} style={{ marginTop: 1 }} />
      <Text style={{ flex: 1, color: palette.muted, fontFamily: "Geist_400Regular", fontSize: 11, lineHeight: 16 }}>{children}</Text>
    </View>
  );
}

function PrimaryAction({ label, onPress, icon = "arrow-right" }: { label: string; onPress: () => void; icon?: string }) {
  return (
    <Button mode="contained" onPress={onPress} icon={icon} contentStyle={{ height: 52, flexDirection: "row-reverse" }} buttonColor={palette.accent} textColor={palette.onAccent} style={{ marginTop: 18, borderRadius: 16 }} labelStyle={{ fontFamily: "Geist_600SemiBold", fontSize: 13 }}>
      {label}
    </Button>
  );
}

function NetworkPicker({ value, onChange }: { value: WalletNetwork; onChange: (network: WalletNetwork) => void }) {
  const options: { network: WalletNetwork; label: string; icon: string; color: string }[] = [
    { network: "Bitcoin", label: "Bitcoin", icon: "bitcoin", color: "#B76500" },
    { network: "Ethereum", label: "Ethereum", icon: "ethereum", color: "#7965D9" },
  ];

  return (
    <View className="flex-row gap-2">
      {options.map((option) => {
        const selected = value === option.network;
        return (
          <Pressable key={option.network} onPress={() => onChange(option.network)} accessibilityRole="button" accessibilityState={{ selected }} className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-2xl px-3" style={{ backgroundColor: selected ? palette.accentSoft : palette.surface, borderColor: selected ? palette.accentBorder : palette.border, borderWidth: 1 }}>
            <MaterialCommunityIcons name={option.icon as never} size={18} color={option.color} />
            <Text style={{ color: selected ? palette.accent : palette.muted, fontFamily: "Geist_600SemiBold", fontSize: 12 }}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function DepositMockup({ network, onNetworkChange }: Pick<Props, "network" | "onNetworkChange">) {
  const bitcoin = network === "Bitcoin";
  const address = bitcoin ? "bc1q…demo…7x9" : "0x71C7…demo…A20f";

  return (
    <>
      <SectionLabel>REDE DE DEPÓSITO</SectionLabel>
      <NetworkPicker value={network} onChange={onNetworkChange} />

      <Surface elevation={0} style={{ width: "100%", marginTop: 20, alignItems: "center", borderRadius: 28, padding: 20, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
        <View className="mb-4 h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: palette.accentSoft }}>
          <MaterialCommunityIcons name={bitcoin ? "bitcoin" : "ethereum"} size={28} color={bitcoin ? "#B76500" : "#7965D9"} />
        </View>
        <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 14 }}>{bitcoin ? "Endereço Bitcoin" : "Endereço Ethereum"}</Text>
        <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 11, marginTop: 4 }}>{bitcoin ? "Bitcoin Mainnet · BTC" : "Ethereum Mainnet · ETH, USDT e tokens"}</Text>

        <View className="my-5 h-44 w-44 items-center justify-center rounded-[24px]" style={{ backgroundColor: palette.background, borderColor: palette.hairline, borderWidth: 1 }}>
          <View className="h-32 w-32 items-center justify-center rounded-2xl" style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border }}>
            <MaterialCommunityIcons name="qrcode" size={104} color={palette.text} />
          </View>
        </View>

        <Text style={{ color: palette.quiet, fontFamily: "Geist_500Medium", fontSize: 10, letterSpacing: 0.6 }}>ENDEREÇO DEMONSTRATIVO</Text>
        <View className="mt-2 w-full flex-row items-center justify-between rounded-2xl px-3.5 py-3" style={{ backgroundColor: palette.background, borderColor: palette.border, borderWidth: 1 }}>
          <Text numberOfLines={1} style={{ color: palette.text, flex: 1, fontFamily: "Geist_600SemiBold", fontSize: 13, letterSpacing: 0.3 }}>{address}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Copiar prévia do endereço" className="ml-2 h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: palette.surface }} onPress={() => Alert.alert("Prévia do endereço", "Este endereço é fictício. A carteira ainda não está conectada.")}>
            <MaterialCommunityIcons name="content-copy" size={17} color={palette.accent} />
          </Pressable>
        </View>
        <DemoNotice>Este QR Code e endereço são ilustrativos. Não use para enviar fundos.</DemoNotice>
      </Surface>

      <View className="mt-4 rounded-2xl px-4 py-4" style={{ backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
        <View className="flex-row items-center justify-between">
          <Text style={{ color: palette.muted, fontFamily: "Geist_500Medium", fontSize: 12 }}>Rede selecionada</Text>
          <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 12 }}>{bitcoin ? "Bitcoin Mainnet" : "Ethereum Mainnet"}</Text>
        </View>
        <View className="my-3 h-px" style={{ backgroundColor: palette.hairline }} />
        <View className="flex-row items-center justify-between">
          <Text style={{ color: palette.muted, fontFamily: "Geist_500Medium", fontSize: 12 }}>Confirmações estimadas</Text>
          <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 12 }}>{bitcoin ? "~10 min" : "~2 min"}</Text>
        </View>
      </View>
    </>
  );
}

function AssetSelector({ assets, value, onChange }: { assets: PortfolioAsset[]; value: string; onChange: (symbol: string) => void }) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {assets.map((asset) => {
        const selected = value === asset.symbol;
        return (
          <Pressable key={asset.symbol} onPress={() => onChange(asset.symbol)} accessibilityRole="button" accessibilityState={{ selected }} className="min-h-11 flex-row items-center gap-1.5 rounded-full px-3" style={{ backgroundColor: selected ? palette.accentSoft : palette.surface, borderColor: selected ? palette.accentBorder : palette.border, borderWidth: 1 }}>
            <MaterialCommunityIcons name={asset.icon as never} size={15} color={asset.color} />
            <Text style={{ color: selected ? palette.accent : palette.muted, fontFamily: "Geist_600SemiBold", fontSize: 11 }}>{asset.symbol}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function AmountInput({ value, onChange, symbol, label = "VALOR" }: { value: string; onChange: (value: string) => void; symbol: string; label?: string }) {
  return (
    <View>
      <SectionLabel>{label}</SectionLabel>
      <View className="min-h-[64px] flex-row items-center gap-3 rounded-2xl px-4" style={{ backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
        <TextInput value={value} onChangeText={onChange} placeholder="0,00" placeholderTextColor={palette.placeholder} keyboardType="decimal-pad" accessibilityLabel={`${label}, ${symbol}`} style={{ color: palette.text, flex: 1, fontFamily: "Geist_600SemiBold", fontSize: 20, paddingVertical: 16 }} />
        <Text style={{ color: palette.muted, fontFamily: "Geist_600SemiBold", fontSize: 13 }}>{symbol}</Text>
      </View>
    </View>
  );
}

function SendMockup({ portfolio, network }: Pick<Props, "portfolio" | "network">) {
  const [assetSymbol, setAssetSymbol] = useState(network === "Bitcoin" ? "BTC" : "ETH");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const asset = portfolio.assets.find((item) => item.symbol === assetSymbol) ?? portfolio.assets[0];
  const selectedNetwork: WalletNetwork = asset?.symbol === "BTC" ? "Bitcoin" : "Ethereum";
  const fee = selectedNetwork === "Bitcoin" ? 1.82 : 0.84;

  return (
    <>
      <SectionLabel>ATIVO</SectionLabel>
      <AssetSelector assets={portfolio.assets} value={asset?.symbol ?? assetSymbol} onChange={setAssetSymbol} />

      <View className="mt-5">
        <SectionLabel>ENDEREÇO DE DESTINO</SectionLabel>
        <View className="min-h-[58px] flex-row items-center gap-2 rounded-2xl px-4" style={{ backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
          <MaterialCommunityIcons name="wallet-outline" size={18} color={palette.quiet} />
          <TextInput value={address} onChangeText={setAddress} placeholder="Cole o endereço da carteira" placeholderTextColor={palette.placeholder} autoCapitalize="none" autoCorrect={false} style={{ color: palette.text, flex: 1, fontFamily: "Geist_400Regular", fontSize: 12, paddingVertical: 16 }} />
          <Pressable onPress={() => Alert.alert("Leitor de QR", "A leitura de QR será conectada nesta etapa.")} accessibilityRole="button" accessibilityLabel="Ler QR Code" className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: palette.raised }}>
            <MaterialCommunityIcons name="qrcode-scan" size={17} color={palette.accent} />
          </Pressable>
        </View>
      </View>

      <View className="mt-5">
        <AmountInput value={amount} onChange={setAmount} symbol={asset?.symbol ?? "BTC"} />
        <View className="mt-2 flex-row items-center justify-between px-1">
          <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 11 }}>Disponível: {asset?.quantity ?? 0} {asset?.symbol}</Text>
          <Pressable onPress={() => setAmount(String(asset?.quantity ?? 0))} accessibilityRole="button" className="px-2 py-1">
            <Text style={{ color: palette.accent, fontFamily: "Geist_600SemiBold", fontSize: 11 }}>USAR TUDO</Text>
          </Pressable>
        </View>
      </View>

      <Surface elevation={0} style={{ width: "100%", marginTop: 20, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
        <SummaryLine label="Rede" value={`${selectedNetwork} Mainnet`} />
        <View className="my-3 h-px" style={{ backgroundColor: palette.hairline }} />
        <SummaryLine label="Taxa estimada" value={`~${formatUsd(fee)}`} />
        <View className="my-3 h-px" style={{ backgroundColor: palette.hairline }} />
        <SummaryLine label="Tempo estimado" value={selectedNetwork === "Bitcoin" ? "~10 min" : "~2 min"} />
      </Surface>
      <PrimaryAction label="Revisar envio" onPress={() => Alert.alert("Prévia de envio", "Mockup pronto. Nenhuma transação foi assinada ou transmitida.")} />
      <DemoNotice>Confira a rede e o endereço antes de qualquer envio real. Esta demonstração não movimenta fundos.</DemoNotice>
    </>
  );
}

function SwapMockup({ portfolio }: Pick<Props, "portfolio">) {
  const [fromSymbol, setFromSymbol] = useState("BTC");
  const [toSymbol, setToSymbol] = useState("ETH");
  const [amount, setAmount] = useState("0,05");
  const [previewVisible, setPreviewVisible] = useState(false);
  const fromAsset = portfolio.assets.find((asset) => asset.symbol === fromSymbol) ?? portfolio.assets[0];
  const toAsset = portfolio.assets.find((asset) => asset.symbol === toSymbol) ?? portfolio.assets[1];
  const numericAmount = Number(amount.replace(",", ".")) || 0;
  const estimatedOutput = fromAsset && toAsset && toAsset.priceUsd > 0 ? (numericAmount * fromAsset.priceUsd) / toAsset.priceUsd : 0;

  function reversePair() {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
  }

  return (
    <>
      <View className="rounded-[28px] p-4" style={{ backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
        <SectionLabel>DE</SectionLabel>
        <View className="min-h-[76px] flex-row items-center rounded-2xl px-4" style={{ backgroundColor: palette.background, borderColor: palette.border, borderWidth: 1 }}>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={{ color: palette.text, flex: 1, fontFamily: "Geist_600SemiBold", fontSize: 23, paddingVertical: 16 }} />
          <TokenMenu assets={portfolio.assets} value={fromSymbol} onChange={setFromSymbol} exclude={toSymbol} />
        </View>
        <View className="z-10 -my-3 items-center">
          <Pressable onPress={reversePair} accessibilityRole="button" accessibilityLabel="Inverter ativos" className="h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
            <MaterialCommunityIcons name="swap-vertical" size={20} color={palette.accent} />
          </Pressable>
        </View>
        <SectionLabel>PARA</SectionLabel>
        <View className="min-h-[76px] flex-row items-center rounded-2xl px-4" style={{ backgroundColor: palette.background, borderColor: palette.border, borderWidth: 1 }}>
          <View className="flex-1">
            <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 23 }}>{estimatedOutput.toFixed(toSymbol === "USDT" ? 2 : 6)}</Text>
            <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 10, marginTop: 3 }}>estimativa de recebimento</Text>
          </View>
          <TokenMenu assets={portfolio.assets} value={toSymbol} onChange={setToSymbol} exclude={fromSymbol} />
        </View>
        <View className="mt-4 flex-row items-center gap-2">
          <MaterialCommunityIcons name="swap-horizontal" size={15} color={palette.accent} />
          <Text style={{ color: palette.muted, fontFamily: "Geist_500Medium", fontSize: 11 }}>1 {fromSymbol} ≈ {fromAsset && toAsset ? (fromAsset.priceUsd / toAsset.priceUsd).toFixed(6) : "0"} {toSymbol}</Text>
        </View>
      </View>

      <Surface elevation={0} style={{ width: "100%", marginTop: 16, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
        <SummaryLine label="Taxa de troca estimada" value="0,15%" />
        <View className="my-3 h-px" style={{ backgroundColor: palette.hairline }} />
        <SummaryLine label="Slippage máximo" value="0,50%" />
        <View className="my-3 h-px" style={{ backgroundColor: palette.hairline }} />
        <SummaryLine label="Cotação" value="Dados de demonstração" />
      </Surface>
      <PrimaryAction label="Pré-visualizar troca" onPress={() => setPreviewVisible(true)} icon="swap-horizontal" />
      {previewVisible && <DemoNotice>A prévia estima {estimatedOutput.toFixed(toSymbol === "USDT" ? 2 : 6)} {toSymbol}. Nenhuma ordem será executada.</DemoNotice>}
      {!previewVisible && <DemoNotice>A cotação é ilustrativa e não representa uma ordem executável.</DemoNotice>}
    </>
  );
}

function TokenMenu({ assets, value, onChange, exclude }: { assets: PortfolioAsset[]; value: string; onChange: (symbol: string) => void; exclude: string }) {
  const current = assets.find((asset) => asset.symbol === value) ?? assets[0];
  const candidates = assets.filter((asset) => asset.symbol !== exclude);
  const next = candidates[(candidates.findIndex((asset) => asset.symbol === value) + 1) % candidates.length];

  return (
    <Pressable onPress={() => next && onChange(next.symbol)} accessibilityRole="button" accessibilityLabel={`Selecionar ativo, atual ${value}`} className="min-h-11 flex-row items-center gap-1.5 rounded-full px-3" style={{ backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
      <MaterialCommunityIcons name={(current?.icon ?? "circle-outline") as never} size={17} color={current?.color ?? palette.accent} />
      <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 12 }}>{value}</Text>
      <MaterialCommunityIcons name="chevron-down" size={14} color={palette.quiet} />
    </Pressable>
  );
}

function AnalyticsMockup({ portfolio }: Pick<Props, "portfolio">) {
  const [period, setPeriod] = useState<BalanceRange>("1M");
  const bestAsset = useMemo(() => portfolio.assets.reduce<PortfolioAsset | null>((best, asset) => !best || asset.changePercent24h > best.changePercent24h ? asset : best, null), [portfolio.assets]);
  const dailyChange = portfolio.assets.reduce((sum, asset) => sum + asset.valueUsd * (asset.changePercent24h / 100), 0);
  const periodFactor: Record<BalanceRange, number> = { "1D": 0.08, "1W": 0.32, "1M": 1, "1Y": 2.4, ALL: 4.8 };
  const periodLabels: Record<BalanceRange, string> = { "1D": "no último dia", "1W": "na última semana", "1M": "no último mês", "1Y": "no último ano", ALL: "desde o início" };
  const periods: BalanceRange[] = ["1W", "1M", "1Y", "ALL"];
  const selectedFactor = periodFactor[period];
  const selectedChangePercent = portfolio.periodChangePercent * selectedFactor;

  return (
    <>
      <Surface elevation={0} style={{ width: "100%", borderRadius: 28, padding: 20, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
        <View className="flex-row items-start justify-between">
          <View>
            <Text style={{ color: palette.quiet, fontFamily: "Geist_500Medium", fontSize: 10, letterSpacing: 1 }}>SALDO DO PORTFÓLIO</Text>
            <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 28, marginTop: 7 }}>{formatUsd(portfolio.totalBalanceUsd)}</Text>
          </View>
          <View className="flex-row items-center gap-1 rounded-full px-2.5 py-1.5" style={{ backgroundColor: palette.positiveSoft }}>
            <MaterialCommunityIcons name="trending-up" size={14} color={palette.positive} />
            <Text style={{ color: palette.positive, fontFamily: "Geist_600SemiBold", fontSize: 11 }}>+{selectedChangePercent.toFixed(1)}%</Text>
          </View>
        </View>
        <Text style={{ color: palette.positive, fontFamily: "Geist_600SemiBold", fontSize: 12, marginTop: 5 }}>+{formatUsd(portfolio.periodChangeUsd * selectedFactor)} {periodLabels[period]}</Text>
        <View className="mt-5"><BalanceChart compact selectedRange={period} /></View>
        <View className="mt-3 flex-row gap-2">
          {periods.map((item) => {
            const selected = period === item;
            return <Pressable key={item} onPress={() => setPeriod(item)} accessibilityRole="button" accessibilityState={{ selected }} className="min-h-9 flex-1 items-center justify-center rounded-full" style={{ backgroundColor: selected ? palette.accentSoft : palette.background, borderColor: selected ? palette.accentBorder : "transparent", borderWidth: 1 }}><Text style={{ color: selected ? palette.accent : palette.quiet, fontFamily: "Geist_600SemiBold", fontSize: 10 }}>{item}</Text></Pressable>;
          })}
        </View>
      </Surface>

      <View className="mt-4 flex-row gap-3">
        <StatCard label="VARIAÇÃO 24H" value={formatUsd(dailyChange)} icon="chart-line-variant" />
        <StatCard label="MELHOR ATIVO" value={bestAsset?.symbol ?? "—"} detail={bestAsset ? `+${bestAsset.changePercent24h.toFixed(2)}%` : undefined} icon="trophy-outline" />
      </View>

      <View className="mt-7 mb-2 flex-row items-end justify-between">
        <View>
          <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 17 }}>Distribuição</Text>
          <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 11, marginTop: 3 }}>Participação de cada ativo</Text>
        </View>
        <Text style={{ color: palette.accent, fontFamily: "Geist_500Medium", fontSize: 10 }}>POR VALOR</Text>
      </View>
      {portfolio.assets.map((asset) => <AssetRow key={asset.id} asset={asset} total={portfolio.totalBalanceUsd} />)}
      <DemoNotice>As variações e cotações são dados de demonstração armazenados localmente.</DemoNotice>
    </>
  );
}

function StatCard({ label, value, detail, icon }: { label: string; value: string; detail?: string; icon: string }) {
  return (
    <Surface elevation={0} style={{ flex: 1, minWidth: 0, minHeight: 112, borderRadius: 16, padding: 14, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
      <View className="mb-3 h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: palette.accentSoft }}><MaterialCommunityIcons name={icon as never} size={16} color={palette.accent} /></View>
      <Text style={{ color: palette.quiet, fontFamily: "Geist_500Medium", fontSize: 9, letterSpacing: 0.7 }}>{label}</Text>
      <Text numberOfLines={1} style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 14, marginTop: 4 }}>{value}</Text>
      {detail && <Text style={{ color: palette.positive, fontFamily: "Geist_500Medium", fontSize: 10, marginTop: 1 }}>{detail}</Text>}
    </Surface>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 11 }}>{label}</Text>
      <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 11 }}>{value}</Text>
    </View>
  );
}

export function WalletFlowScreen({ flow, portfolio, network, onNetworkChange, onBack }: Props) {
  return (
    <View className="w-full self-center" style={{ maxWidth: 420 }}>
      <FlowHeader flow={flow} onBack={onBack} />
      {flow === "deposit" && <DepositMockup network={network} onNetworkChange={onNetworkChange} />}
      {flow === "send" && <SendMockup portfolio={portfolio} network={network} />}
      {flow === "swap" && <SwapMockup portfolio={portfolio} />}
      {flow === "analytics" && <AnalyticsMockup portfolio={portfolio} />}
    </View>
  );
}
