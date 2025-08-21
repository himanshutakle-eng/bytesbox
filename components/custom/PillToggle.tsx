import { useThemeContext } from "@/contexts/ThemeContexts";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Option = { key: string; label: string };

type Props = {
  options: Option[];
  value: string;
  onChange: (key: string) => void;
};

const PillToggle = ({ options, value, onChange }: Props) => {
  const { colors } = useThemeContext();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.surface,
        padding: 15,
        borderRadius: 999,
        alignSelf: "center",
        marginVertical: 12,
        elevation: 3,
      }}
    >
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 999,
              backgroundColor: active ? colors.accent : undefined,
              marginHorizontal: 4,
            }}
          >
            <Text style={{ color: active ? "white" : colors.textPrimary }}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default PillToggle;
