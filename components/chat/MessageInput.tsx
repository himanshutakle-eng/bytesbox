import { useThemeContext } from "@/contexts/ThemeContexts";
import { height, width } from "@/utils/Mixings";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../screens/Chat/Styles";
import { ReplyPreview } from "./ReplyPreview";

interface MessageInputProps {
  text: string;
  onTextChange: (text: string) => void;
  onSend: () => void;
  onStartRecording: () => void;
  onShowMediaOptions: () => void;
  replyingTo: any;
  onCancelReply: any;
  onTapReply: any;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  text,
  onTextChange,
  onSend,
  onStartRecording,
  onShowMediaOptions,
  replyingTo,
  onCancelReply,
  onTapReply,
}) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const handleMediaOptionsPress = () => {
    Keyboard.dismiss();
    setTimeout(() => onShowMediaOptions(), 100);
  };

  return (
    <>
      {replyingTo && (
        <ReplyPreview
          replyMessage={replyingTo}
          onCancel={onCancelReply || (() => {})}
          onTapReply={() => onTapReply && onTapReply(replyingTo.id)}
        />
      )}
      <TouchableOpacity
        onPress={onShowMediaOptions}
        style={[customStyle.iconButton, { backgroundColor: colors.card }]}
      >
        <MaterialIcons name="add" size={22} color={colors.accent} />
      </TouchableOpacity>

      <View
        style={[
          customStyle.inputContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <TextInput
          value={text}
          onChangeText={onTextChange}
          placeholder={t("chat.type")}
          placeholderTextColor={colors.textSecondary}
          style={{ flex: 1 }}
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
      </View>

      <TouchableOpacity
        onPress={text.trim() ? onSend : onStartRecording}
        style={[
          styles.sendButton,
          {
            backgroundColor: text.trim() ? colors.accent : colors.accent,
          },
        ]}
      >
        <MaterialIcons
          name={text.trim() ? "send" : "mic"}
          size={20}
          color="white"
        />
      </TouchableOpacity>
    </>
  );
};

const customStyle = StyleSheet.create({
  iconButton: {
    width: width(0.11),
    height: width(0.11),
    borderRadius: width(0.055),
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputContainer: {
    flex: 1,
    borderRadius: width(0.09),
    borderWidth: 1,
    paddingHorizontal: width(0.04),
    paddingVertical: height(0.01),
    minHeight: width(0.11),
    maxHeight: height(0.15),
    flexDirection: "row",
    alignItems: "center",
    maxWidth: width(0.7),
  },
});

// import { useThemeContext } from "@/contexts/ThemeContexts";
// import { width, height } from "@/utils/Mixings";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import React, { useEffect, useRef } from "react";
// import { StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
// import { ReplyPreview } from "./ReplyPreview";

// interface ReplyMessage {
//   id: string;
//   text?: string;
//   mediaUrl?: string;
//   mediaType?: string;
//   senderId: string;
//   senderName?: string;
// }

// interface MessageInputProps {
//   text: string;
//   onTextChange: (text: string) => void;
//   onSend: () => void;
//   onStartRecording: () => void;
//   onShowMediaOptions: () => void;
//   replyingTo?: ReplyMessage | null;
//   onCancelReply?: () => void;
//   onTapReply?: (messageId: string) => void;
// }

// export const MessageInput: React.FC<MessageInputProps> = ({
//   text,
//   onTextChange,
//   onSend,
//   onStartRecording,
//   onShowMediaOptions,
//   replyingTo,
//   onCancelReply,
//   onTapReply,
// }) => {
//   const { colors } = useThemeContext();
//   const textInputRef = useRef<TextInput>(null);

//   // Auto-focus when replying
//   useEffect(() => {
//     if (replyingTo && textInputRef.current) {
//       setTimeout(() => {
//         textInputRef.current?.focus();
//       }, 100);
//     }
//   }, [replyingTo]);

//   const handleSend = () => {
//     if (text.trim()) {
//       onSend();
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
//       {replyingTo && (
//         <ReplyPreview
//           replyMessage={replyingTo}
//           onCancel={onCancelReply || (() => {})}
//           onTapReply={() => onTapReply && onTapReply(replyingTo.id)}
//         />
//       )}
//       <View style={styles.inputWrapper}>
//         {/* Attachment Button */}
//         <TouchableOpacity
//           onPress={onShowMediaOptions}
//           style={[styles.iconButton, { backgroundColor: colors.card }]}
//         >
//           <MaterialIcons
//             name="add"
//             size={22}
//             color={colors.accent}
//           />
//         </TouchableOpacity>

//         {/* Text Input Container */}
//         <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
//           <TextInput
//             ref={textInputRef}
//             style={[
//               styles.textInput,
//               {
//                 color: colors.textPrimary,
//               },
//             ]}
//             value={text}
//             onChangeText={onTextChange}
//             placeholder={replyingTo ? "Reply..." : "Type a message..."}
//             placeholderTextColor={colors.textSecondary}
//             multiline
//             maxLength={1000}
//             textAlignVertical="top"
//           />
//         </View>

//         {/* Send/Mic Button */}
//         <TouchableOpacity
//           onPress={text.trim() ? handleSend : onStartRecording}
//           style={[
//             styles.sendButton,
//             {
//               backgroundColor: text.trim()
//                 ? colors.accent
//                 : colors.textSecondary,
//             },
//           ]}
//         >
//           <MaterialIcons
//             name={text.trim() ? "send" : "mic"}
//             size={20}
//             color="white"
//           />
//         </TouchableOpacity>

//         {/* E2E Encryption Indicator */}
//         <View style={styles.encryptionIndicator}>
//           <MaterialIcons name="lock" size={10} color={colors.textSecondary} />
//           <Text style={[styles.encryptionText, { color: colors.textSecondary }]}>E2E</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: width(0.04),
//     paddingVertical: height(0.015),
//     borderTopWidth: 1,
//   },
//   inputWrapper: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     gap: width(0.02),
//     position: "relative",
//   },
//   iconButton: {
//     width: width(0.11),
//     height: width(0.11),
//     borderRadius: width(0.055),
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   inputContainer: {
//     flex: 1,
//     borderRadius: width(0.06),
//     borderWidth: 1,
//     paddingHorizontal: width(0.04),
//     paddingVertical: height(0.01),
//     minHeight: width(0.11),
//     maxHeight: height(0.15),
//     elevation: 1,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 1,
//   },
//   textInput: {
//     fontSize: 16,
//     lineHeight: 20,
//     paddingVertical: height(0.008),
//   },
//   sendButton: {
//     width: width(0.11),
//     height: width(0.11),
//     borderRadius: width(0.055),
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 3,
//   },
//   encryptionIndicator: {
//     position: "absolute",
//     bottom: height(0.002),
//     right: width(0.15),
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   encryptionText: {
//     fontSize: 8,
//     fontWeight: "500",
//     marginTop: 1,
//   },
// });
