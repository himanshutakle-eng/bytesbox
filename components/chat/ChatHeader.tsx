import { useThemeContext } from "@/contexts/ThemeContexts";
import { formatTime } from "@/utils/formateTime";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

interface ChatHeaderProps {
  otherUser: any;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ otherUser }) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      {otherUser?.profileUrl ? (
        <Image
          source={{ uri: otherUser.profileUrl }}
          style={{ width: 32, height: 32, borderRadius: 16 }}
        />
      ) : (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#777",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            {(otherUser?.userName || otherUser?.email || "?").slice(0, 1)}
          </Text>
        </View>
      )}
      <View>
        <Text style={{ fontWeight: "700", color: colors.textPrimary }}>
          {otherUser?.userName || otherUser?.email || ""}
        </Text>
        <Text
          style={{
            fontSize: 11,
            opacity: 0.75,
            color: colors.textSecondary,
          }}
        >
          {otherUser?.status === "online"
            ? t("chat.online")
            : t("chat.last_seen", {
                time: formatTime(otherUser?.lastSeen),
              })}
        </Text>
      </View>
    </View>
  );
};
