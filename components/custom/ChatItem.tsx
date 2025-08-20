import { Colors } from "@/constants/Colors";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { width } from "@/utils/Mixings";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  item: any;
};

function formatTime(ts: any) {
  try {
    const d = ts?.toDate ? ts.toDate() : new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

const ChatItem = ({ item }: Props) => {
  const { isDark, colors } = useThemeContext();
  const { t } = useTranslation();

  const name =
    item?.otherUser?.userName ||
    item?.userName ||
    item?.otherUser?.email ||
    item?.email ||
    "";
  const avatar = item?.otherUser?.profileUrl || item?.profileUrl;
  const lastMessage = item?.lastMessage?.text || "";
  const lastMessageTime = formatTime(
    item?.lastMessage?.createdAt || item?.createdAt
  );

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/chat/[chatId]",
          params: { chatId: item.id },
        })
      }
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.card : "white" },
      ]}
    >
      <View style={styles.imgWrapper}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.img} />
        ) : (
          <View style={[styles.img, styles.fallback]}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {name?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.nameContainer}>
        <Text style={{ color: colors.textPrimary, fontWeight: "600" }}>
          {name}
        </Text>
        {lastMessage ? (
          <Text style={{ color: colors.textSecondary }} numberOfLines={1}>
            {lastMessage}
          </Text>
        ) : (
          <Text style={{ color: colors.textSecondary }}>
            {item?.otherUser?.status === "online"
              ? t("chat.online")
              : t("chat.offline")}
          </Text>
        )}
      </View>

      <Text style={{ color: colors.textSecondary, marginLeft: "auto" }}>
        {lastMessageTime}
      </Text>
    </Pressable>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  imgWrapper: {
    height: width(0.12),
    width: width(0.12),
    borderRadius: width(0.06),
    overflow: "hidden",
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  fallback: {
    backgroundColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: {
    flex: 1,
    paddingLeft: width(0.04),
  },
});
