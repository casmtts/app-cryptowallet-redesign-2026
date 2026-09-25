import { useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { Text } from "react-native-paper";
import { palette } from "../theme";

const ranges = ["1D", "1W", "1M", "1Y", "ALL"] as const;
export type BalanceRange = (typeof ranges)[number];

const paths: Record<BalanceRange, string> = {
  "1D": "M 2 84 C 34 76, 47 87, 72 65 S 109 69, 128 50 S 159 58, 187 40 S 223 49, 249 27 S 288 31, 318 10",
  "1W": "M 2 88 C 27 77, 47 80, 71 62 S 109 71, 132 49 S 169 56, 194 37 S 229 45, 256 28 S 293 20, 318 10",
  "1M": "M 2 90 C 26 92, 43 77, 67 78 S 103 49, 126 59 S 163 49, 183 44 S 213 50, 244 30 S 287 35, 318 8",
  "1Y": "M 2 95 C 23 84, 44 90, 62 75 S 100 82, 124 62 S 161 68, 187 49 S 222 54, 248 30 S 286 32, 318 6",
  ALL: "M 2 91 C 22 77, 43 83, 63 65 S 99 79, 124 52 S 158 66, 183 44 S 218 57, 245 27 S 285 35, 318 5",
};

type Props = {
  compact?: boolean;
  selectedRange?: BalanceRange;
};

export function BalanceChart({ compact = false, selectedRange }: Props) {
  const [range, setRange] = useState<BalanceRange>("1M");
  const activeRange = selectedRange ?? range;
  const line = paths[activeRange];
  const area = `${line} L 318 106 L 2 106 Z`;

  return (
    <View className="w-full">
      <View className="w-full overflow-hidden" style={{ height: compact ? 76 : 112 }}>
        <Svg width="100%" height="100%" viewBox="0 0 320 110" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={palette.accent} stopOpacity="0.16" />
              <Stop offset="1" stopColor={palette.accent} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path d={area} fill="url(#chartFill)" />
          <Path d={line} fill="none" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      </View>
      {!compact && (
        <View className="mt-3 flex-row items-center justify-between rounded-full px-1 py-1" style={{ backgroundColor: palette.raised }}>
          {ranges.map((option) => {
            const selected = option === range;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setRange(option)}
                className="min-h-9 min-w-12 items-center justify-center rounded-full px-3"
                style={selected ? { backgroundColor: palette.surface, borderColor: palette.accentBorder, borderWidth: 1 } : undefined}
              >
                <Text style={{ color: selected ? palette.accent : palette.quiet, fontSize: 11, fontFamily: selected ? "Geist_600SemiBold" : "Geist_500Medium" }}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
