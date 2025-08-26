import { useThemeContext } from "@/contexts/ThemeContexts";
import { formatDuration } from "@/utils/formateTime";
import { width } from "@/utils/Mixings";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AudioPlayerProps {
  uri: string;
  isMyMessage: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  uri,
  isMyMessage,
}) => {
  const { colors } = useThemeContext();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playPauseAudio = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              setDuration(status.durationMillis || 0);
              setPosition(status.positionMillis || 0);
              setIsPlaying(status.isPlaying || false);
            }
          }
        );
        setSound(newSound);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isMyMessage ? colors.tabActive : colors.background,
        borderRadius: width(0.5),
        padding: 12,
        paddingVertical: 20,
        minWidth: 200,
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity onPress={playPauseAudio}>
        <FontAwesome
          name={isPlaying ? "pause" : "play"}
          size={16}
          color={isMyMessage ? "white" : colors.accent}
        />
      </TouchableOpacity>

      <View style={{ flex: 1, maxWidth: "55%", paddingTop: 3 }}>
        <View
          style={{
            height: 1,
            backgroundColor: isMyMessage
              ? "rgba(255,255,255,0.3)"
              : colors.border,
            borderRadius: 1,
            marginBottom: 4,
          }}
        >
          <View
            style={{
              height: "100%",
              backgroundColor: isMyMessage ? "white" : colors.accent,
              borderRadius: 1,
              width: duration > 0 ? `${(position / duration) * 100}%` : "0%",
            }}
          />
        </View>
      </View>
      <Text
        style={{
          fontSize: 10,
          color: isMyMessage ? "rgba(255,255,255,0.8)" : colors.textSecondary,
        }}
      >
        {formatDuration(position)} / {formatDuration(duration)}
      </Text>
    </View>
  );
};
