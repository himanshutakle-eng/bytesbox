// import { useThemeContext } from "@/contexts/ThemeContexts";
// import { width } from "@/utils/Mixings";
// import Entypo from "@expo/vector-icons/Entypo";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import React from "react";
// import { useTranslation } from "react-i18next";
// import {
//   Keyboard,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import styles from "../../screens/Chat/Styles";

// interface MessageInputProps {
//   text: string;
//   onTextChange: (text: string) => void;
//   onSend: () => void;
//   onStartRecording: () => void;
//   onShowMediaOptions: () => void;
// }

// export const MessageInput: React.FC<MessageInputProps> = ({
//   text,
//   onTextChange,
//   onSend,
//   onStartRecording,
//   onShowMediaOptions,
// }) => {
//   const { colors } = useThemeContext();
//   const { t } = useTranslation();

//   const handleMediaOptionsPress = () => {
//     Keyboard.dismiss();
//     setTimeout(() => onShowMediaOptions(), 100);
//   };

//   return (
//     <>
//       <TouchableOpacity
//         onPress={handleMediaOptionsPress}
//         style={styles.addButton}
//       >
//         <Entypo name="plus" size={18} color="#4F46E5" />
//       </TouchableOpacity>

//       <TextInput
//         value={text}
//         onChangeText={onTextChange}
//         placeholder={t("chat.type")}
//         placeholderTextColor={colors.textSecondary}
//         style={[
//           styles.txtInputBar,
//           {
//             borderColor: colors.border,
//             backgroundColor: colors.card,
//             color: colors.textPrimary,
//           },
//         ]}
//         multiline
//         maxLength={1000}
//       />

//       <View style={{ alignItems: "center", marginHorizontal: 4 }}>
//         <MaterialIcons name="lock" size={8} color={colors.textSecondary} />
//         <Text
//           style={{
//             fontSize: 8,
//             color: colors.textSecondary,
//             marginTop: 1,
//           }}
//         >
//           E2E
//         </Text>
//       </View>

//       <TouchableOpacity
//         onPress={onStartRecording}
//         style={{
//           padding: 10,
//           backgroundColor: colors.tabActive,
//           borderRadius: width(0.5),
//         }}
//       >
//         <MaterialIcons name="mic" size={18} color="white" />
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={onSend}
//         style={[
//           styles.sendButton,
//           {
//             opacity: !text.trim() ? 0.5 : 1,
//             backgroundColor: colors.tabActive,
//           },
//         ]}
//         disabled={!text.trim()}
//       >
//         <Text style={styles.sendButtonText}>{t("chat.send")}</Text>
//       </TouchableOpacity>
//     </>
//   );
// };

import { useThemeContext } from "@/contexts/ThemeContexts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface ReplyMessage {
  id: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  senderId: string;
  senderName?: string;
}

interface MessageInputProps {
  text: string;
  onTextChange: (text: string) => void;
  onSend: () => void;
  onStartRecording: () => void;
  onShowMediaOptions: () => void;
  replyingTo?: ReplyMessage | null;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  text,
  onTextChange,
  onSend,
  onStartRecording,
  onShowMediaOptions,
  replyingTo,
}) => {
  const { colors } = useThemeContext();
  const textInputRef = useRef<TextInput>(null);

  // Auto-focus when replying
  useEffect(() => {
    if (replyingTo && textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [replyingTo]);

  const handleSend = () => {
    if (text.trim()) {
      onSend();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View
        style={[styles.inputContainer, { backgroundColor: colors.background }]}
      >
        {/* Attachment Button */}
        <TouchableOpacity
          onPress={onShowMediaOptions}
          style={styles.iconButton}
        >
          <MaterialIcons
            name="attach-file"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          ref={textInputRef}
          style={[
            styles.textInput,
            {
              color: colors.textPrimary,
              backgroundColor: colors.background,
            },
          ]}
          value={text}
          onChangeText={onTextChange}
          placeholder={replyingTo ? "Reply..." : "Type a message..."}
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={1000}
          textAlignVertical="center"
        />

        {/* Send/Mic Button */}
        <TouchableOpacity
          onPress={text.trim() ? handleSend : onStartRecording}
          style={[
            styles.sendButton,
            {
              backgroundColor: text.trim()
                ? colors.accent
                : colors.textSecondary,
            },
          ]}
        >
          <MaterialIcons
            name={text.trim() ? "send" : "mic"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 25,
    paddingHorizontal: 4,
    paddingVertical: 4,
    minHeight: 50,
  },
  iconButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 42,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
});
