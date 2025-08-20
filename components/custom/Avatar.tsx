import React from "react";
import { Image, Text, View } from "react-native";

type Props = {
  uri?: string;
  size?: number;
  fallback?: string;
};

const Avatar = ({ uri, size = 40, fallback = "?" }: Props) => {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#C7D2FE",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#111827", fontWeight: "700" }}>{fallback}</Text>
    </View>
  );
};

export default Avatar;
