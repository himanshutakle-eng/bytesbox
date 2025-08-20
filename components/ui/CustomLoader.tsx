import { useThemeContext } from "@/contexts/ThemeContexts";
import React from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  message: string;
};

const CustomLoader = ({ message }: Props) => {
  const { colors } = useThemeContext();
  return (
    <SafeAreaView style={styles.screen}>
      <ActivityIndicator color={colors.tabActive} size={"large"} />
      <Text>{message}...</Text>
    </SafeAreaView>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
