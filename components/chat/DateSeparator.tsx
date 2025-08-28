import React from "react";
import { Text, View } from "react-native";

interface DateSeparatorProps {
  date: string;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  return (
    <View
      style={{
        alignItems: "center",
        marginVertical: 10,
      }}
    >
      <View
        style={{
          backgroundColor: "#E0E0E0",
          borderRadius: 12,
          paddingVertical: 4,
          paddingHorizontal: 12,
        }}
      >
        <Text style={{ fontSize: 12, color: "#333" }}>{date}</Text>
      </View>
    </View>
  );
};
