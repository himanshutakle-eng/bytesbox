import { Colors } from "@/constants/Colors";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { fontSize, height, width } from "@/utils/Mixings";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { colors, isDark } = useThemeContext();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  return (
    <View
      style={[
        styles.tabBar,
        { backgroundColor: isDark ? colors.background : colors.background },
      ]}
    >
      {state.routes.map((item, index) => {
        const { options } = descriptors[item.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : item.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: item.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            router.replace(item.name as never);
          }
        };

        const color = isFocused
          ? Colors[colorScheme ?? "light"].tabActive
          : Colors[colorScheme ?? "light"].tabInactive;

        return (
          <TouchableOpacity
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            style={styles.btn}
            key={item.key}
          >
            <Ionicons
              name={
                label === "Chat"
                  ? "chatbubble-outline"
                  : label === "Request"
                  ? "notifications-outline"
                  : "settings-outline"
              }
              size={20}
              color={color}
            />
            <Text style={[styles.txt, { color }]}>
              {label === "Chat"
                ? t("tabs.chat")
                : label === "Request"
                ? t("tabs.request")
                : t("tabs.settings")}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabBar: {
    display: "flex",
    flexDirection: "row",
    height: height(0.08),
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: width(0.1),
    width: width(0.9),
    alignSelf: "center",
    borderRadius: width(0.5),
    elevation: 3,
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  txt: {
    fontSize: fontSize(0.028),
    marginTop: width(0.01),
  },
});
