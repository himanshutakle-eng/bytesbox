import { useThemeContext } from "@/contexts/ThemeContexts";
import { width } from "@/utils/Mixings";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";
import styles from "./Styles";

type Props = {
  handleLogout: () => Promise<void>;
  user: any;
};

const Settings = ({ handleLogout, user }: Props) => {
  const { t, i18n } = useTranslation();
  const { themeMode, setThemeMode, isDark, colors } = useThemeContext();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingHorizontal: width(0.03) },
      ]}
    >
      <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
        <View style={styles.profileImageContainer}>
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
            />
          ) : (
            <View
              style={[
                styles.profileImagePlaceholder,
                { backgroundColor: colors.accent },
              ]}
            >
              <Text style={[styles.profileImageText, { color: colors.card }]}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <View
            style={[styles.onlineIndicator, { backgroundColor: colors.accent }]}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.textPrimary }]}>
            {user?.name || "User"}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
            {user?.email || "user@example.com"}
          </Text>
          <View style={styles.profileStatus}>
            <View
              style={[styles.statusDot, { backgroundColor: colors.accent }]}
            />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              Online
            </Text>
          </View>
        </View>
      </View>
      <View style={{ padding: 16, gap: 18, width: "100%" }}>
        <View style={{ gap: 10 }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            {"Theme"}
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <SettingChip
              label="Light"
              onPress={() => setThemeMode("light")}
              active={themeMode === "light"}
            />
            <SettingChip
              label="Dark"
              onPress={() => setThemeMode("dark")}
              active={themeMode === "dark"}
            />
            <SettingChip
              label="System"
              onPress={() => setThemeMode("system")}
              active={themeMode === "system"}
            />
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            {"Language"}
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <SettingChip
              label="English"
              onPress={() => i18n.changeLanguage("en")}
              active={i18n.language === "en"}
            />
            <SettingChip
              label="हिंदी"
              onPress={() => i18n.changeLanguage("hi")}
              active={i18n.language === "hi"}
            />
          </View>
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => ({
            marginTop: 8,
            backgroundColor: "#EF4444",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            {t("settings.logout")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Settings;

type ChipProps = { label: string; onPress: () => void; active?: boolean };
const SettingChip = ({ label, onPress, active }: ChipProps) => {
  const { colors } = useThemeContext();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: active ? colors.accent : colors.surface,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <Text style={{ color: active ? "white" : colors.textPrimary }}>
        {label}
      </Text>
    </Pressable>
  );
};
