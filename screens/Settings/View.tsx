import { useThemeContext } from "@/contexts/ThemeContexts";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./Styles";

type Props = {
  handleLogout: () => Promise<void>;
};

const Settings = ({ handleLogout }: Props) => {
  const { t, i18n } = useTranslation();
  const { themeMode, setThemeMode, isDark, colors } = useThemeContext();

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={{ padding: 16, gap: 16 }}>
        <Text
          style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "700" }}
        >
          {t("tabs.settings")}
        </Text>

        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.textSecondary }}>{"Theme"}</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button title="Light" onPress={() => setThemeMode("light")} />
            <Button title="Dark" onPress={() => setThemeMode("dark")} />
            <Button title="System" onPress={() => setThemeMode("system")} />
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.textSecondary }}>{"Language"}</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button title="English" onPress={() => i18n.changeLanguage("en")} />
            <Button title="हिंदी" onPress={() => i18n.changeLanguage("hi")} />
          </View>
        </View>

        <Button title={t("settings.logout")} onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
};

export default Settings;
