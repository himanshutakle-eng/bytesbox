import { useThemeContext } from "@/contexts/ThemeContexts";
import { width } from "@/utils/Mixings";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./Styles";

type Props = {};

const Splash = (props: Props) => {
  const { isDark, colors } = useThemeContext();
  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={styles.logoWrap}>
        <Image
          source={require("@/assets/images/rename.gif")}
          style={{
            width: width(0.35),
            height: width(0.35),
            resizeMode: "cover",
          }}
        />
        <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
          ByteBox
        </Text>
        <Text style={[styles.brandTag, { color: colors.textSecondary }]}>
          Fast, simple, private chat
        </Text>
      </View>
      {/* <ActivityIndicator size="small" color={Colors.light.tint} /> */}
    </SafeAreaView>
  );
};

export default Splash;
