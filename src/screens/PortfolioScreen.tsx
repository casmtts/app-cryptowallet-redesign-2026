import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Dialog, Portal, Surface, Text } from "react-native-paper";

import { getPortfolio, getSamplePortfolio } from "../api/portfolio";
import { AssetRow } from "../components/AssetRow";
import { BalanceChart } from "../components/BalanceChart";
import { WalletFlowScreen, type WalletFlow, type WalletNetwork } from "./WalletFlowScreen";
import type { Portfolio, PortfolioAsset } from "../types/portfolio";
import { palette } from "../theme";

type PortfolioAction = {
  title: string;
  icon: string;
  description: string;
  primaryLabel?: string;
  onPrimaryPress?: () => void;
};

const networkOptions: { name: WalletNetwork; icon: string; descriptor: string; color: string }[] = [
  { name: "Ethereum", icon: "ethereum", descriptor: "Ethereum Mainnet", color: "#7965D9" },
  { name: "Bitcoin", icon: "bitcoin", descriptor: "Bitcoin Mainnet", color: "#B76500" },
];

const actions: PortfolioAction[] = [
  { title: "Depósito", icon: "arrow-down-left", description: "Compartilhe um endereço ou QR Code para receber cripto." },
  { title: "Enviar", icon: "arrow-top-right", description: "Escolha um ativo e informe o endereço de destino." },
  { title: "Comprar", icon: "plus", description: "Conecte um provedor de compra para continuar." },
  { title: "Staking", icon: "chart-donut", description: "Veja oportunidades de rendimento para seus ativos." },
];

const formatUsd = (amount: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(amount);

function ActionItem({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title} className="flex-1 items-center gap-2">
      <Surface elevation={0} style={{ height: 56, width: 56, alignItems: "center", justifyContent: "center", borderRadius: 28, backgroundColor: title === "Comprar" ? palette.accentSoft : palette.raised, borderColor: title === "Comprar" ? palette.accentBorder : palette.border, borderWidth: 1 }}>
        <MaterialCommunityIcons name={icon as never} size={22} color={title === "Comprar" ? palette.accent : palette.muted} />
      </Surface>
      <Text style={{ color: title === "Comprar" ? palette.accent : palette.muted, fontFamily: "Geist_500Medium", fontSize: 11 }}>{title}</Text>
    </Pressable>
  );
}

function AllocationBar({ assets, total }: { assets: PortfolioAsset[]; total: number }) {
  const shares = useMemo(() => assets.map((asset) => (total > 0 ? (asset.valueUsd / total) * 100 : 0)), [assets, total]);

  return (
    <View>
      <View className="h-2.5 flex-row overflow-hidden rounded-full" style={{ backgroundColor: palette.raised }}>
        {assets.map((asset, index) => (
          <View key={asset.id} style={{ width: `${shares[index]}%`, height: "100%", backgroundColor: asset.color }} />
        ))}
      </View>
      <View className="mt-3 flex-row flex-wrap gap-x-4 gap-y-2">
        {assets.map((asset, index) => (
          <View key={asset.id} className="flex-row items-center gap-1.5">
            <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: asset.color }} />
            <Text style={{ color: palette.quiet, fontFamily: "Geist_500Medium", fontSize: 10 }}>{asset.symbol}</Text>
            <Text style={{ color: palette.muted, fontFamily: "Geist_600SemiBold", fontSize: 10 }}>{Math.round(shares[index])}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PortfolioScreen({ onSignOut }: { onSignOut?: () => void }) {
  const insets = useSafeAreaInsets();
  const [portfolio, setPortfolio] = useState<Portfolio>(getSamplePortfolio());
  const [refreshing, setRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState<"loading" | "connected" | "offline">("loading");
  const [hidden, setHidden] = useState(false);
  const [selectedAction, setSelectedAction] = useState<PortfolioAction | null>(null);
  const [network, setNetwork] = useState<WalletNetwork>("Ethereum");
  const [networkPickerVisible, setNetworkPickerVisible] = useState(false);
  const [activeView, setActiveView] = useState<"portfolio" | WalletFlow>("portfolio");
  const total = portfolio.totalBalanceUsd;
  const activeNetwork = networkOptions.find((item) => item.name === network) ?? networkOptions[0];

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      const result = await getPortfolio(signal);
      setPortfolio(result);
      setApiStatus("connected");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setApiStatus("offline");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <View className="flex-1" style={{ backgroundColor: palette.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ width: "100%", maxWidth: 460, alignSelf: "center", paddingHorizontal: 20, paddingTop: Math.max(insets.top, 10), paddingBottom: 142 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.accent} colors={[palette.accent]} />}
        showsVerticalScrollIndicator={false}
      >
        {activeView === "portfolio" ? (
          <>
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Surface elevation={0} style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: palette.accentSoft, borderColor: palette.accentBorder, borderWidth: 1 }}>
              <MaterialCommunityIcons name="hexagon-multiple-outline" size={19} color={palette.accent} />
            </Surface>
            <View>
              <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 14, letterSpacing: -0.2 }}>CryptoApp</Text>
              <Text style={{ color: palette.quiet, fontFamily: "Geist_500Medium", fontSize: 9, letterSpacing: 1.8, marginTop: 2 }}>WALLET</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <HeaderIconButton
              icon="bell-outline"
              color={palette.muted}
              onPress={() => setSelectedAction({ title: "Notificações", icon: "bell-outline", description: "Você está em dia. Novas atividades aparecem aqui." })}
            />
            <HeaderIconButton
              icon="account-circle-outline"
              color={palette.muted}
              onPress={() => setSelectedAction({ title: "Minha conta", icon: "account-circle-outline", description: "Este acesso está em modo de demonstração.", primaryLabel: onSignOut ? "Sair da carteira" : undefined, onPrimaryPress: onSignOut })}
            />
          </View>
        </View>

        <View className="mb-4 flex-row items-end justify-between">
          <View>
            <View className="mb-2 flex-row items-center gap-2">
              <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: apiStatus === "connected" ? palette.positive : apiStatus === "offline" ? palette.quiet : palette.accent }} />
              <Text style={{ color: palette.quiet, fontFamily: "Geist_500Medium", fontSize: 10, letterSpacing: 1.2 }}>
                {apiStatus === "connected" ? "API CONECTADA" : apiStatus === "offline" ? "MODO DEMONSTRAÇÃO" : "CONECTANDO À API"}
              </Text>
            </View>
            <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 25, letterSpacing: -0.8 }}>Portfólio</Text>
          </View>
          <Pressable
            onPress={() => setNetworkPickerVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={`Selecionar rede. Rede atual: ${network}`}
            className="mb-1 flex-row items-center gap-1.5 rounded-full px-3 py-2"
            style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border }}
          >
            <MaterialCommunityIcons name={activeNetwork.icon as never} size={14} color={activeNetwork.color} />
            <Text style={{ color: palette.muted, fontFamily: "Geist_500Medium", fontSize: 10 }}>{activeNetwork.name}</Text>
            <MaterialCommunityIcons name="chevron-down" size={14} color={palette.quiet} />
          </Pressable>
        </View>

        <Surface elevation={0} style={{ overflow: "hidden", borderRadius: 32, padding: 20, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
          <View className="flex-row items-center justify-between">
            <Text style={{ color: palette.quiet, fontFamily: "Geist_500Medium", fontSize: 10, letterSpacing: 1.15 }}>SALDO TOTAL</Text>
            <HeaderIconButton
              icon={hidden ? "eye-off-outline" : "eye-outline"}
              color={palette.quiet}
              onPress={() => setHidden((value) => !value)}
              accessibilityLabel={hidden ? "Mostrar saldo" : "Ocultar saldo"}
              compact
            />
          </View>
          <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 31, lineHeight: 39, letterSpacing: -1.2, fontVariant: ["tabular-nums"], marginTop: 6 }}>
            {hidden ? "••••••••" : formatUsd(total)}
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            {hidden ? (
              <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 10 }}>Variação oculta</Text>
            ) : (
              <>
                <View className="flex-row items-center gap-1 rounded-full px-2 py-1" style={{ backgroundColor: palette.positiveSoft }}>
                  <MaterialCommunityIcons name="trending-up" size={13} color={palette.positive} />
                  <Text style={{ color: palette.positive, fontFamily: "Geist_600SemiBold", fontSize: 11 }}>
                    +{formatUsd(portfolio.periodChangeUsd)} ({portfolio.periodChangePercent.toFixed(1)}%)
                  </Text>
                </View>
                <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 10 }}>nos últimos 30 dias</Text>
              </>
            )}
          </View>
          <View className="mt-5">
            {hidden ? <View style={{ height: 112 }} /> : <BalanceChart />}
          </View>
        </Surface>

        <View className="mt-5 flex-row justify-between px-1">
          {actions.map((action) => (
            <ActionItem
              key={action.title}
              {...action}
              onPress={() => {
                if (action.title === "Depósito") setActiveView("deposit");
                else if (action.title === "Enviar") setActiveView("send");
                else setSelectedAction(action);
              }}
            />
          ))}
        </View>

        <View className="mt-7">
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 15 }}>Alocação</Text>
              <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 11, marginTop: 3 }}>Distribuição dos seus ativos</Text>
            </View>
            <Text style={{ color: palette.accent, fontFamily: "Geist_500Medium", fontSize: 11 }}>Por saldo</Text>
          </View>
          <AllocationBar assets={portfolio.assets} total={total} />
        </View>

        <View className="mt-7">
          <View className="mb-1 flex-row items-end justify-between">
            <View>
              <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 17 }}>Seus ativos</Text>
              <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 11, marginTop: 3 }}>{portfolio.assets.length} ativos na carteira</Text>
            </View>
            <Pressable onPress={() => setSelectedAction({ title: "Todos os ativos", icon: "format-list-bulleted", description: "A lista completa de ativos será exibida nesta área." })} className="flex-row items-center gap-1 rounded-full px-3 py-2" style={{ backgroundColor: palette.surface }}>
              <Text style={{ color: palette.accent, fontFamily: "Geist_600SemiBold", fontSize: 10, letterSpacing: 0.4 }}>VER TODOS</Text>
              <MaterialCommunityIcons name="chevron-right" size={14} color={palette.accent} />
            </Pressable>
          </View>
          <View className="mt-1">
            {portfolio.assets.map((asset, index) => (
              <AssetRow key={asset.id} asset={asset} total={total} hidden={hidden} last={index === portfolio.assets.length - 1} />
            ))}
          </View>
        </View>

        <View className="mt-3 flex-row items-center justify-between rounded-2xl px-4 py-3" style={{ backgroundColor: palette.surface, borderColor: palette.hairline, borderWidth: 1 }}>
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="shield-check-outline" size={16} color={palette.positive} />
            <View>
              <Text style={{ color: palette.muted, fontFamily: "Geist_500Medium", fontSize: 10 }}>Dados de mercado</Text>
              <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 9, marginTop: 2 }}>Valores de demonstração salvos no PostgreSQL</Text>
            </View>
          </View>
          <Text style={{ color: palette.positive, fontFamily: "Geist_600SemiBold", fontSize: 9, letterSpacing: 0.5 }}>{apiStatus === "connected" ? "API ONLINE" : "SAMPLE"}</Text>
        </View>
          </>
        ) : (
          <WalletFlowScreen
            flow={activeView}
            portfolio={portfolio}
            network={network}
            onNetworkChange={setNetwork}
            onBack={() => setActiveView("portfolio")}
          />
        )}
      </ScrollView>

      <View pointerEvents="box-none" className="absolute bottom-0 left-0 right-0 items-center px-5" style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
        <Surface elevation={0} style={{ width: "100%", maxWidth: 420, flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 8, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }}>
          <NavigationItem title="Portfólio" icon="view-dashboard-outline" active={activeView === "portfolio"} onPress={() => setActiveView("portfolio")} />
          <NavigationItem title="Troca" icon="swap-horizontal" active={activeView === "swap"} onPress={() => setActiveView("swap")} />
          <NavigationItem title="Depósito" icon="arrow-down-circle-outline" active={activeView === "deposit"} onPress={() => setActiveView("deposit")} />
          <NavigationItem title="Análises" icon="chart-box-outline" active={activeView === "analytics"} onPress={() => setActiveView("analytics")} />
        </Surface>
      </View>

      <Portal>
        <Dialog visible={networkPickerVisible} onDismiss={() => setNetworkPickerVisible(false)} style={{ backgroundColor: palette.surface, borderRadius: 26, borderColor: palette.border, borderWidth: 1 }}>
          <Dialog.Title style={{ color: palette.text, fontFamily: "Geist_600SemiBold" }}>Selecionar rede</Dialog.Title>
          <Dialog.Content>
            <View className="gap-2">
              {networkOptions.map((option) => {
                const selected = network === option.name;
                return (
                  <Pressable
                    key={option.name}
                    onPress={() => {
                      setNetwork(option.name);
                      setNetworkPickerVisible(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    className="min-h-[64px] flex-row items-center gap-3 rounded-2xl px-4"
                    style={{ backgroundColor: selected ? palette.accentSoft : palette.background, borderColor: selected ? palette.accentBorder : palette.border, borderWidth: 1 }}
                  >
                    <MaterialCommunityIcons name={option.icon as never} size={23} color={option.color} />
                    <View className="flex-1">
                      <Text style={{ color: palette.text, fontFamily: "Geist_600SemiBold", fontSize: 13 }}>{option.name}</Text>
                      <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 11, marginTop: 2 }}>{option.descriptor}</Text>
                    </View>
                    <MaterialCommunityIcons name={selected ? "check-circle" : "circle-outline"} size={20} color={selected ? palette.accent : palette.quiet} />
                  </Pressable>
                );
              })}
            </View>
            <Text style={{ color: palette.quiet, fontFamily: "Geist_400Regular", fontSize: 11, lineHeight: 16, marginTop: 14 }}>
              O saldo exibido continua agregado entre os ativos da carteira.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setNetworkPickerVisible(false)} labelStyle={{ color: palette.accent, fontFamily: "Geist_600SemiBold" }}>Fechar</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={selectedAction !== null} onDismiss={() => setSelectedAction(null)} style={{ backgroundColor: palette.raised, borderRadius: 26, borderColor: palette.border, borderWidth: 1 }}>
          <View style={{ alignItems: "center", paddingTop: 24 }}>
            <View style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: palette.accentSoft }}>
              <MaterialCommunityIcons name={(selectedAction?.icon ?? "information-outline") as never} size={22} color={palette.accent} />
            </View>
          </View>
          <Dialog.Title style={{ color: palette.text, fontFamily: "Geist_600SemiBold", textAlign: "center" }}>{selectedAction?.title}</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: palette.muted, fontFamily: "Geist_400Regular", textAlign: "center" }}>{selectedAction?.description}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                selectedAction?.onPrimaryPress?.();
                setSelectedAction(null);
              }}
              labelStyle={{ color: palette.accent, fontFamily: "Geist_600SemiBold" }}
            >
              {selectedAction?.primaryLabel ?? "Entendi"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

function HeaderIconButton({ icon, color, onPress, accessibilityLabel, compact = false }: { icon: string; color: string; onPress: () => void; accessibilityLabel?: string; compact?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? icon}
      className="items-center justify-center rounded-full"
      style={{ width: compact ? 40 : 42, height: compact ? 40 : 42, backgroundColor: compact ? "transparent" : palette.surface }}
    >
      <MaterialCommunityIcons name={icon as never} size={20} color={color} />
    </Pressable>
  );
}

function NavigationItem({ title, icon, active = false, onPress }: { title: string; icon: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }} className="min-w-[68px] items-center gap-1 rounded-full px-2 py-1.5">
      <MaterialCommunityIcons name={icon as never} size={19} color={active ? palette.accent : palette.quiet} />
      <Text style={{ color: active ? palette.accent : palette.quiet, fontFamily: active ? "Geist_600SemiBold" : "Geist_500Medium", fontSize: 9 }}>{title}</Text>
    </Pressable>
  );
}
