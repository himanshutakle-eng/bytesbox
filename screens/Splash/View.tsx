import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./Styles";

type Props = {};

const Splash = (props: Props) => {
  return (
    <SafeAreaView style={styles.screen}>
      <Text>Splash Screen</Text>
    </SafeAreaView>
  );
};

export default Splash;
