import { useThemeContext } from "@/contexts/ThemeContexts";
import { formatTime } from "@/utils/formateTime";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import styles from "../../screens/Chat/Styles";

interface InstantMessageProps {
  text: string;
  createdAt: Date;
  status: "sending" | "sent" | "failed";
  onRetry?: () => void;
}

export const InstantMessageItem: React.FC<InstantMessageProps> = ({
  text,
  createdAt,
  status,
  onRetry,
}) => {
  const { colors } = useThemeContext();

  return (
    <Pressable style={[styles.msgItem, { justifyContent: "flex-end" }]}>
      <View
        style={[
          styles.msgSubItem,
          {
            backgroundColor: colors.accent,
            padding: 10,
            borderRadius: 12,
            opacity: status === "failed" ? 0.7 : 1,
          },
        ]}
      >
        <View style={styles.msgTxt}>
          <Text style={{ color: "white" }}>{text}</Text>
        </View>

        {status === "failed" && onRetry && (
          <Pressable onPress={onRetry} style={{ marginTop: 4 }}>
            <Text style={{ color: "#ffcccb", fontSize: 12 }}>
              Failed to send - Tap to retry
            </Text>
          </Pressable>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Text style={[styles.time, { color: "#E6E6E6" }]}>
            {formatTime(createdAt)}
          </Text>

          {/* Status indicator */}
          {status === "sending" && (
            <MaterialIcons
              name="schedule"
              size={12}
              color="#E6E6E6"
              style={{ marginLeft: 4 }}
            />
          )}
          {status === "sent" && (
            <MaterialIcons
              name="done"
              size={12}
              color="#E6E6E6"
              style={{ marginLeft: 4 }}
            />
          )}
          {status === "failed" && (
            <MaterialIcons
              name="error-outline"
              size={12}
              color="#ffcccb"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};
