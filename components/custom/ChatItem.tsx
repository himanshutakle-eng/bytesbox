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
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={[styles.imgWrapper, { borderColor: colors.border }]}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.img} />
        ) : (
          <View
            style={[
              styles.img,
              styles.fallback,
              { backgroundColor: colors.accent },
            ]}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              {name?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.nameContainer}>
        <Text
          style={{
            color: colors.textPrimary,
            fontWeight: "700",
            fontSize: 16,
            marginBottom: 4,
          }}
        >
          {name}
        </Text>
        {lastMessage ? (
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              lineHeight: 18,
            }}
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
        ) : (
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              fontStyle: "italic",
            }}
          >
            {item?.otherUser?.status === "online"
              ? t("chat.online")
              : t("chat.offline")}
          </Text>
        )}
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 12,
            fontWeight: "500",
            marginBottom: 4,
          }}
        >
          {lastMessageTime}
        </Text>
        {item?.otherUser?.status === "online" && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#4CAF50",
            }}
          />
        )}
      </View>
    </Pressable>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light.border,
    gap: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imgWrapper: {
    height: width(0.14),
    width: width(0.14),
    borderRadius: width(0.07),
    overflow: "hidden",
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E6E6E6",
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
    paddingLeft: width(0.02),
  },
});
