import ChatItem from "@/components/custom/ChatItem";
import { useThemeContext } from "@/contexts/ThemeContexts";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl, Text, View } from "react-native";
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

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ display: "flex", flex: 1, backgroundColor: colors.background }}
    >
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <ChatItem item={item} />}
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
