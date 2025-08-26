import { useThemeContext } from "@/contexts/ThemeContexts";
import { width } from "@/utils/Mixings";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../screens/Chat/Styles";

interface MessageInputProps {
  text: string;
  onTextChange: (text: string) => void;
  onSend: () => void;
  onStartRecording: () => void;
  onShowMediaOptions: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  text,
  onTextChange,
  onSend,
  onStartRecording,
  onShowMediaOptions,
}) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const handleMediaOptionsPress = () => {
    Keyboard.dismiss();
    setTimeout(() => onShowMediaOptions(), 100);
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleMediaOptionsPress}
        style={styles.addButton}
      >
        <Entypo name="plus" size={18} color="#4F46E5" />
      </TouchableOpacity>

      <TextInput
        value={text}
        onChangeText={onTextChange}
        placeholder={t("chat.type")}
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.txtInputBar,
          {
            borderColor: colors.border,
            backgroundColor: colors.card,
            color: colors.textPrimary,
          },
        ]}
        multiline
        maxLength={1000}
      />

      <View style={{ alignItems: "center", marginHorizontal: 4 }}>
        <MaterialIcons name="lock" size={8} color={colors.textSecondary} />
        <Text
          style={{
            fontSize: 8,
            color: colors.textSecondary,
            marginTop: 1,
          }}
        >
          E2E
        </Text>
      </View>

      <TouchableOpacity
        onPress={onStartRecording}
        style={{
          padding: 10,
          backgroundColor: colors.tabActive,
          borderRadius: width(0.5),
        }}
      >
        <MaterialIcons name="mic" size={18} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSend}
        style={[
          styles.sendButton,
          {
            opacity: !text.trim() ? 0.5 : 1,
            backgroundColor: colors.tabActive,
          },
        ]}
        disabled={!text.trim()}
      >
        <Text style={styles.sendButtonText}>{t("chat.send")}</Text>
      </TouchableOpacity>
    </>
  );
};
