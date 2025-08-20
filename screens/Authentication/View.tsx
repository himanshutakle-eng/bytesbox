import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./Styles";

type Props = {
  onPress: () => Promise<void>;
  isLoading: boolean;
};

const Authentication = ({ onPress, isLoading }: Props) => {
  return (
    <SafeAreaView style={styles.screen}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={onPress}
        disabled={isLoading}
      />
    </SafeAreaView>
  );
};

export default Authentication;
