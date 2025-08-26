import { useThemeContext } from "@/contexts/ThemeContexts";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChatInputBar({ onSend }: { onSend: any }) {
  const [message, setMessage] = useState("");
  const { colors } = useThemeContext();

  const handleSend = () => {
    if (!message.trim()) return;
    onSend({ text: message, type: "text" });
    setMessage("");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
        style={{ flex: 1, color: colors.text }}
      />
      <TouchableOpacity onPress={handleSend}>
        <Text style={{ color: colors.accent }}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}
