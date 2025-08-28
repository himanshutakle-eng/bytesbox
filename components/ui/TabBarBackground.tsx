import { Colors } from "@/constants/Colors";
import { useColorScheme, View } from "react-native";

function TabBarBackground() {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].tabActive,
      }}
    />
  );
}

export default TabBarBackground;
