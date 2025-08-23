import { Colors } from "@/constants/Colors";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { width } from "@/utils/Mixings";
import { lightenColor } from "@/utils/Shade";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  item: any;
  selectedChats: string[];
  setSelectedChats: React.Dispatch<React.SetStateAction<string[]>>;
  isSelectionMode: boolean;
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
};

function formatTime(ts: any) {
  try {
    const d = ts?.toDate ? ts.toDate() : new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

const ChatItem = ({
  item,
  selectedChats,
  setSelectedChats,
  isSelectionMode,
  setIsSelectionMode,
}: Props) => {
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

  const isSelected = selectedChats.includes(item.id);

  const handlePress = () => {
    if (isSelectionMode) {
      handleToggleSelection();
    } else {
      router.push({
        pathname: "/chat/[chatId]",
        params: { chatId: item.id },
      });
    }
  };

  const handleLongPress = () => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedChats([item.id]);
    } else {
      handleToggleSelection();
    }
  };

  const handleToggleSelection = () => {
    setSelectedChats((prevSelected) => {
      const newSelected = prevSelected.includes(item.id)
        ? prevSelected.filter((id) => id !== item.id)
        : [...prevSelected, item.id];

      if (newSelected.length === 0) {
        setIsSelectionMode(false);
      }

      return newSelected;
    });
  };

  return (
    <View
      style={{
        backgroundColor: isSelected
          ? lightenColor(colors.tabActive, 50)
          : colors.card,
        marginBottom: width(0.01),
      }}
    >
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={[
          styles.container,
          {
            backgroundColor: isSelected
              ? lightenColor(colors.tabActive, 50)
              : colors.card,
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
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
              >
                {name?.[0]?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
        </View>
        {isSelectionMode && (
          <View style={styles.selectionOverlay}>
            {isSelected && (
              <View
                style={[
                  styles.selectionIndicator,
                  {
                    backgroundColor: isSelected
                      ? colors.tabActive
                      : colors.background,
                    borderWidth: 0,
                  },
                ]}
              >
                <Ionicons name="checkmark" size={18} color="white" />
              </View>
            )}
          </View>
        )}

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
          {item?.otherUser?.status === "online" && !isSelectionMode && (
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
    </View>
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
    position: "relative",
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
  selectionOverlay: {
    position: "absolute",
    bottom: width(0.05),
    left: width(0.14),
    zIndex: 1,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
