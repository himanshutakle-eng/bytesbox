import ChatItem from "@/components/custom/ChatItem";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { width } from "@/utils/Mixings";
import { Feather, Octicons } from "@expo/vector-icons";
import { deleteDoc, doc, getFirestore } from "@react-native-firebase/firestore";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  data: any;
  loading: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
};

const ChatList = ({ data, loading, onRefresh, refreshing = false }: Props) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [chatData, setChatData] = useState([]);
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (selectedChats.length > 0) {
          return (
            <TouchableOpacity
              style={{ marginHorizontal: width(0.06) }}
              onPress={() => {
                deleteMultipleChats(selectedChats);
                setIsSelectionMode(false);
                setSelectedChats([]);
              }}
            >
              <Octicons name="trash" size={24} color={colors.text} />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            style={{ marginHorizontal: width(0.06) }}
            onPress={() =>
              router.push({ pathname: "/users", params: { user: "user" } })
            }
          >
            <Feather name="plus-circle" size={24} color={colors.text} />
          </TouchableOpacity>
        );
      },
    });
  }, [navigation, selectedChats, colors]);

  async function deleteMultipleChats(chatIds: string[]) {
    try {
      const db = getFirestore();
      const promises = chatIds.map((id) => deleteDoc(doc(db, "chats", id)));

      await Promise.all(promises);
      console.log("Chats deleted successfully");
    } catch (error) {
      console.error("Error deleting chats:", error);
    }
  }

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ display: "flex", flex: 1, backgroundColor: colors.background }}
    >
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ChatItem
            item={item}
            selectedChats={selectedChats}
            setSelectedChats={setSelectedChats}
            isSelectionMode={isSelectionMode}
            setIsSelectionMode={setIsSelectionMode}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        ListEmptyComponent={
          loading ? null : (
            <View
              style={{
                padding: 40,
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 16,
                  textAlign: "center",
                  lineHeight: 24,
                }}
              >
                {t("chat.empty")}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 8,
                  opacity: 0.7,
                }}
              >
                Start a conversation with someone!
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default ChatList;
