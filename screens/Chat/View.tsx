import { Colors } from "@/constants/Colors";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { usePresence } from "@/hooks/usePresence";
import { Message } from "@/Types";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./Styles";

type Props = {
  otherUser?: any | null;
};

const ChatView = ({ otherUser }: Props) => {
  const { colors } = useThemeContext();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const { t } = useTranslation();
  const formatTime = (ts: any) => {
    try {
      const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
      if (!d) return "";
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  usePresence();

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = firestore()
      .collection("chats")
      .doc(String(chatId))
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Message[];
        setMessages(list);
      });
    return () => unsubscribe();
  }, [chatId]);

  const send = async () => {
    if (!text.trim() || !chatId) return;
    await firestore()
      .collection("chats")
      .doc(String(chatId))
      .collection("messages")
      .add({
        text: text.trim(),
        senderId: auth().currentUser?.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    // update chat summary
    await firestore()
      .collection("chats")
      .doc(String(chatId))
      .set(
        {
          lastMessage: {
            text: text.trim(),
            createdAt: firestore.FieldValue.serverTimestamp(),
          },
        },
        { merge: true }
      );
    setText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          gap: 12,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            overflow: "hidden",
            backgroundColor: "#ccc",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {otherUser?.profileUrl ? (
            // We avoid importing Image to keep header lightweight; avatar initial fallback is shown otherwise
            <Text />
          ) : (
            <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>
              {(otherUser?.userName || otherUser?.email || "?").slice(0, 1)}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>
            {otherUser?.userName || otherUser?.email || ""}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
            {otherUser?.status === "online"
              ? t("chat.online")
              : t("chat.last_seen", { time: formatTime(otherUser?.lastSeen) })}
          </Text>
        </View>
      </View>

      <FlatList
        inverted
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              flexDirection: "row",
              justifyContent:
                item.senderId === auth().currentUser?.uid
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            <View
              style={{
                maxWidth: "80%",
                backgroundColor:
                  item.senderId === auth().currentUser?.uid
                    ? colors.accent
                    : colors.card,
                padding: 10,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color:
                    item.senderId === auth().currentUser?.uid
                      ? "white"
                      : colors.textPrimary,
                }}
              >
                {item.text}
              </Text>
              {item.createdAt && (
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 10,
                    color:
                      item.senderId === auth().currentUser?.uid
                        ? "#E6E6E6"
                        : colors.textSecondary,
                    textAlign: "right",
                  }}
                >
                  {formatTime(item.createdAt)}
                </Text>
              )}
            </View>
          </View>
        )}
      />
      <View style={[styles.inputBar, { borderTopColor: Colors.light.border }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t("chat.type")}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: Colors.light.border,
            padding: 12,
            borderRadius: 8,
          }}
        />
        <TouchableOpacity onPress={send} style={{ padding: 12 }}>
          <Text>{t("chat.send")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatView;
