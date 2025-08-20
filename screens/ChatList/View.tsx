import ChatItem from "@/components/custom/ChatItem";
import { useThemeContext } from "@/contexts/ThemeContexts";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  data: any;
  loading: boolean;
};

const ChatList = ({ data, loading }: Props) => {
  const { isDark, colors } = useThemeContext();
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
        ListEmptyComponent={
          loading ? null : (
            <View style={{ padding: 24, alignItems: "center" }}>
              <Text style={{ color: colors.textSecondary }}>
                {t("chat.empty")}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default ChatList;
