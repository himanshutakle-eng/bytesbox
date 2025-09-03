import { useThemeContext } from "@/contexts/ThemeContexts";
import { width } from "@/utils/Mixings";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
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
          source={require("@/assets/images/rename.gif")}
          style={{
            width: width(0.35),
            height: width(0.35),
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
      {/* <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={onPress}
        disabled={isLoading}
      /> */}
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Image
            source={require("../../assets/images/Google__G__logo.svg")}
            style={styles.icon}
          />
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Authentication;
