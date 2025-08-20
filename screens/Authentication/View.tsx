import { useThemeContext } from "@/contexts/ThemeContexts";
import { width } from "@/utils/Mixings";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./Styles";

type Props = {
  onPress: () => Promise<void>;
  isLoading: boolean;
};

const Authentication = ({ onPress, isLoading }: Props) => {
  const { colors } = useThemeContext();
  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={styles.headerWrap}>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={{
            width: width(0.2),
            height: width(0.2),
            resizeMode: "contain",
          }}
        />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Welcome to ByteBox
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sign in to continue
        </Text>
      </View>
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
