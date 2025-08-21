import { useThemeContext } from "@/contexts/ThemeContexts";
import { width } from "@/utils/Mixings";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import styles from "./Styles";

type Props = {
  handleLogout: () => Promise<void>;
  user: {
    userName?: string;
    email?: string;
    profileUrl?: string;
  } | null;
};

const Settings = ({ handleLogout, user }: Props) => {
  const { t, i18n } = useTranslation();
  const { themeMode, setThemeMode, colors } = useThemeContext();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingHorizontal: width(0.03) },
      ]}
    >
      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
        <View style={styles.profileImageContainer}>
          {user?.profileUrl ? (
            <Image
              source={{ uri: user.profileUrl }}
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
                {user?.userName?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <View
            style={[styles.onlineIndicator, { backgroundColor: colors.accent }]}
          />
        </View>

        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.textPrimary }]}>
            {user?.userName || "User"}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
            {user?.email || "user@example.com"}
          </Text>
          <View style={styles.profileStatus}>
            <View
              style={[styles.statusDot, { backgroundColor: colors.accent }]}
            />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {t("settings.online", "Online")}
            </Text>
          </View>
        </View>
      </View>

      {/* Settings Options */}
      <View style={localStyles.sectionWrapper}>
        {/* Theme Section */}
        <View style={localStyles.section}>
          <Text
            style={[localStyles.sectionLabel, { color: colors.textSecondary }]}
          >
            {t("settings.theme", "Theme")}
          </Text>
          <View style={localStyles.row}>
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

        {/* Language Section */}
        <View style={localStyles.section}>
          <Text
            style={[localStyles.sectionLabel, { color: colors.textSecondary }]}
          >
            {t("settings.language", "Language")}
          </Text>
          <View style={localStyles.row}>
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

        {/* Logout Button */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            localStyles.logoutButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={localStyles.logoutText}>
            {t("settings.logout", "Logout")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Settings;

/* -------------------- Setting Chip -------------------- */
type ChipProps = { label: string; onPress: () => void; active?: boolean };
const SettingChip = ({ label, onPress, active }: ChipProps) => {
  const { colors } = useThemeContext();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        localStyles.chip,
        {
          backgroundColor: active ? colors.accent : colors.surface,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text style={{ color: active ? "white" : colors.textPrimary }}>
        {label}
      </Text>
    </Pressable>
  );
};

/* -------------------- Local Styles -------------------- */
const localStyles = StyleSheet.create({
  sectionWrapper: {
    padding: 16,
    gap: 18,
    width: "100%",
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    marginBottom: 8,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  logoutButton: {
    marginTop: 8,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "700",
  },
});
