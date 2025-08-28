import { useThemeContext } from "@/contexts/ThemeContexts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, Text, View } from "react-native";

interface ReplyMessage {
  id: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  senderId: string;
  senderName?: string;
}

interface ReplyIndicatorProps {
  replyMessage: ReplyMessage;
  isMyMessage: boolean;
}

export const ReplyIndicator: React.FC<ReplyIndicatorProps> = ({
  replyMessage,
  isMyMessage,
}) => {
  const { colors } = useThemeContext();

  const getMediaIcon = (mediaType: string) => {
    if (mediaType?.includes("image")) return "image";
    if (mediaType?.includes("video")) return "videocam";
    if (mediaType?.includes("audio")) return "mic";
    return "attach-file";
  };

  const getMediaText = (mediaType: string) => {
    if (mediaType?.includes("image")) return "Photo";
    if (mediaType?.includes("video")) return "Video";
    if (mediaType?.includes("audio")) return "Audio";
    return "File";
  };

  const borderColor = isMyMessage ? "rgba(255, 255, 255, 0.3)" : colors.border;

  const textColor = isMyMessage
    ? "rgba(255, 255, 255, 0.8)"
    : colors.textSecondary;

  const senderColor = isMyMessage ? "rgba(255, 255, 255, 0.9)" : colors.accent;

  return (
    <View
      style={{
        borderLeftWidth: 3,
        borderLeftColor: senderColor,
        paddingLeft: 8,
        paddingVertical: 4,
        marginBottom: 6,
        backgroundColor: isMyMessage
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.05)",
        borderRadius: 4,
      }}
    >
      {/* Sender Name */}
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: senderColor,
          marginBottom: 2,
        }}
        numberOfLines={1}
      >
        {replyMessage.senderName || "Unknown"}
      </Text>

      {/* Reply Content */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {replyMessage.mediaUrl && (
          <>
            {replyMessage.mediaType?.includes("image") ? (
              <Image
                source={{ uri: replyMessage.mediaUrl }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 4,
                  marginRight: 8,
                }}
                resizeMode="cover"
              />
            ) : (
              <MaterialIcons
                name={getMediaIcon(replyMessage.mediaType || "")}
                size={16}
                color={textColor}
                style={{ marginRight: 6 }}
              />
            )}
          </>
        )}

        <Text
          style={{
            fontSize: 13,
            color: textColor,
            flex: 1,
            fontStyle: replyMessage.text ? "normal" : "italic",
          }}
          numberOfLines={2}
        >
          {replyMessage.text ||
            (replyMessage.mediaUrl
              ? getMediaText(replyMessage.mediaType || "")
              : "Message")}
        </Text>
      </View>
    </View>
  );
};
