import UserItem from "@/components/custom/UserItem";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./Styles";

type Props = {
  data: User[];
  onPress: any;
  params: any;
  query?: string;
  setQuery?: (q: string) => void;
};

type User = {
  id: string;
  userName: string;
  email: string;
  photoURL?: string;
  role?: string;
  createdAt?: any;
};

const Users = ({ data, onPress, params, query = "", setQuery }: Props) => {
  const { t } = useTranslation();
  if (data.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text>{t("users.empty")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {typeof setQuery === "function" && (
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("users.search")}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 12,
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
        </View>
      )}
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <UserItem
            item={item}
            index={index}
            onPress={onPress}
            params={params}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Users;
