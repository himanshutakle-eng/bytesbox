import ChatItem from "@/components/custom/ChatItem";
import { useThemeContext } from "@/contexts/ThemeContexts";
import React from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  data: any;
  loading: boolean;
};

const ChatList = ({ data, loading }: Props) => {
  const { isDark, colors } = useThemeContext();
  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ display: "flex", flex: 1, backgroundColor: "white" }}
    >
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <ChatItem item={item} />}
        ListEmptyComponent={
          <Text style={{ padding: 16 }}>{loading ? "" : "chat.empty"}</Text>
        }
      />
    </SafeAreaView>
  );
};

export default ChatList;
