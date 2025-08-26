import { useThemeContext } from "@/contexts/ThemeContexts";
import { formatDuration } from "@/utils/formateTime";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RecordingBarProps {
  recordingDuration: number;
  onCancel: () => void;
  onStop: () => void;
}

export const RecordingBar: React.FC<RecordingBarProps> = ({
  recordingDuration,
  onCancel,
  onStop,
}) => {
  const { colors } = useThemeContext();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 8,
        padding: 12,
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#ff4444",
            marginRight: 8,
          }}
        />
        <Text style={{ color: colors.textPrimary, flex: 1 }}>
          Recording... {formatDuration(recordingDuration)}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onCancel}
        style={{
          padding: 8,
          marginRight: 8,
        }}
      >
        <MaterialIcons name="close" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onStop}
        style={{
          backgroundColor: colors.accent,
          borderRadius: 20,
          padding: 10,
        }}
      >
        <MaterialIcons name="send" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};
