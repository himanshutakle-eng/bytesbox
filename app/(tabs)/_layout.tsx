import { router, Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import CustomTabBar from "@/components/tabUI/CustomTabBar";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { width } from "@/utils/Mixings";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
      initialRouteName="chatlist"
    >
      <Tabs.Screen
        name="chatlist"
        options={{
          title: t("tabs.chat"),
          headerRight: () => (
            <TouchableOpacity
              style={{ marginHorizontal: width(0.06) }}
              onPress={() =>
                router.push({ pathname: "/users", params: { user: "user" } })
              }
            >
              <Feather name="plus-circle" size={24} color="black" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="request"
        options={{
          title: t("tabs.request"),
          tabBarIcon: ({ color }) => (
            <Feather name="bell" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
