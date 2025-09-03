import UserItem from "@/components/custom/UserItem";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { capitalizeFirstChar } from "@/utils/addDateSeparators";
import { width } from "@/utils/Mixings";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
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
  const route = useRoute(); // ✅ current route
  const navigation = useNavigation(); // ✅ navigation
  const {colors} = useThemeContext()


  // if (data.length === 0) {
  //   return (
  //     <SafeAreaView style={[styles.screen, {backgroundColor:colors.background}]}>
  //       <View style={{ alignItems: "center", marginTop: 20 }}>
  //         <Text style={{color:colors.text}}>{t("users.empty")}</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={[styles.screen, {backgroundColor:colors.background}]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          marginBottom: width(0.03),
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-sharp" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "bold", color:colors.text }}>
          {capitalizeFirstChar(route?.name)}
        </Text>
      </View>
      {typeof setQuery === "function" && (
        <View
          style={{
            paddingHorizontal: 16,
            marginBottom: 8,
          }}
        >
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("users.search")}
            placeholderTextColor={colors.text}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 15,
              marginBottom: 8,
              borderRadius: width(0.5),
              color:colors.text
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
        ListEmptyComponent={<SafeAreaView style={[styles.screen, {backgroundColor:colors.background}]}>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{color:colors.text}}>{t("users.empty")}</Text>
        </View>
      </SafeAreaView>}
      />
    </SafeAreaView>
  );
};

export default Users;
