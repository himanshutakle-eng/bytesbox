import PillToggle from "@/components/custom/PillToggle";
import UserItem from "@/components/custom/UserItem";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { height } from "@/utils/Mixings";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";
import styles from "./Styles";

type Props = {
  data: any;
  activeTab: "Received" | "Sent" | "Declined";
  setActiveTab: any;
  onAccept: any;
  onDecline: any;
  onRequestAgain?: any;
};

const Request = ({
  data,
  activeTab,
  setActiveTab,
  onAccept,
  onDecline,
  onRequestAgain,
}: Props) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  // if (data.length === 0) {
  //   return (
  //     <View style={styles.screen}>
  //       <Text>No request found</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={{display:'flex', flex:1, backgroundColor:colors.background}}>
      <PillToggle
        options={[
          { key: "Received", label: t("request.received") },
          { key: "Sent", label: t("request.sent") },
          { key: "Declined", label: t("request.declined") },
        ]}
        value={activeTab}
        onChange={setActiveTab}
      />
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <UserItem
            item={item}
            index={index}
            onAccept={onAccept}
            onDecline={onDecline}
            onRequestAgain={onRequestAgain}
            params={activeTab}
          />
        )}
        ListEmptyComponent={
          <View style={styles.screen}>
            <Text style={{color:colors.text}}>{t("request.empty")}</Text>
          </View>
        }
        contentContainerStyle={{
          flexGrow: 1,
          minHeight: height(0.7),
        }}
      />
    </View>
  );
};

export default Request;
