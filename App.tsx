import "./global.css";

import { useFonts } from "@expo-google-fonts/geist/useFonts";
import { Geist_400Regular } from "@expo-google-fonts/geist/400Regular";
import { Geist_500Medium } from "@expo-google-fonts/geist/500Medium";
import { Geist_600SemiBold } from "@expo-google-fonts/geist/600SemiBold";
import { Geist_700Bold } from "@expo-google-fonts/geist/700Bold";
import { StatusBar } from "react-native";
import { useState } from "react";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { PortfolioScreen } from "./src/screens/PortfolioScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { palette } from "./src/theme";

const theme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.accent,
    onPrimary: palette.onAccent,
    primaryContainer: "#CBE9EA",
    background: palette.background,
    surface: palette.surface,
    surfaceVariant: palette.raised,
    onSurface: palette.text,
    onSurfaceVariant: palette.muted,
    outline: palette.border,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    default: { ...MD3LightTheme.fonts.default, fontFamily: "Geist_400Regular" },
    bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontFamily: "Geist_400Regular" },
    titleLarge: { ...MD3LightTheme.fonts.titleLarge, fontFamily: "Geist_600SemiBold" },
    titleMedium: { ...MD3LightTheme.fonts.titleMedium, fontFamily: "Geist_500Medium" },
  },
};

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor={palette.background} />
        {authenticated ? (
          <PortfolioScreen onSignOut={() => setAuthenticated(false)} />
        ) : (
          <AuthScreen onAuthenticated={() => setAuthenticated(true)} />
        )}
      </PaperProvider>
    </SafeAreaProvider>
  );
}
