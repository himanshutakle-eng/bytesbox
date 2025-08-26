import { useThemeContext } from "@/contexts/ThemeContexts";
import { height, width } from "@/utils/Mixings";
import { lightenColor } from "@/utils/Shade";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AudioPlayerProps {
  uri: string;
}

export default function AudioPlayer({ uri }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const { colors } = useThemeContext();

  const animatedValues = useState(() =>
    Array.from({ length: 30 }, () => new Animated.Value(0.2))
  )[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  const formatTime = (ms: number) => {
    if (!ms || ms === 0 || !isFinite(ms)) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let intervalId: any;
    if (sound && isPlaying) {
      intervalId = setInterval(async () => {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && status.isPlaying) {
            setPosition(status.positionMillis || 0);
            if (status.didJustFinish) {
              setIsPlaying(false);
              stopWaveformAnimation();
            }
          }
        } catch {}
      }, 200);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [sound, isPlaying]);

  const startWaveformAnimation = () => {
    animatedValues.forEach((val, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 0.4 + Math.random() * 0.8,
            duration: 300 + i * 15,
            useNativeDriver: false,
          }),
          Animated.timing(val, {
            toValue: 0.2 + Math.random() * 0.5,
            duration: 250 + i * 10,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopWaveformAnimation = () => {
    animatedValues.forEach((val) => {
      val.stopAnimation();
      Animated.timing(val, {
        toValue: 0.2,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
    pulseAnim.stopAnimation();
  };

  const seekToPosition = async (progress: number) => {
    if (sound && duration > 0 && isLoaded) {
      const seekPos = Math.max(0, Math.min(progress * duration, duration));
      await sound.setPositionAsync(seekPos);
      setPosition(seekPos);
    }
  };

  const togglePlayback = async () => {
    try {
      setIsLoading(true);
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: false }
        );
        setSound(newSound);
        const status = await newSound.getStatusAsync();
        if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
          setIsLoaded(true);
        }
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.positionMillis !== undefined) {
            setPosition(status.positionMillis);
          }
          if (status?.didJustFinish) {
            setIsPlaying(false);
            stopWaveformAnimation();
          }
        });
        await newSound.playAsync();
        setIsPlaying(true);
        startWaveformAnimation();
      } else {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
          stopWaveformAnimation();
        } else {
          await sound.playAsync();
          setIsPlaying(true);
          startWaveformAnimation();
        }
      }
    } catch (e) {
      setPlaybackError("Playback error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync().catch(() => {});
          stopWaveformAnimation();
        }
      : undefined;
  }, [sound]);

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const currentTime = formatTime(position);
  const totalTime = formatTime(duration);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          { backgroundColor: lightenColor(colors.accent, 30) },
        ]}
      >
        <Animated.View
          style={[
            styles.playButtonContainer,
            { transform: [{ scale: isPlaying ? pulseAnim : 1 }] },
          ]}
        >
          <TouchableOpacity onPress={togglePlayback} activeOpacity={0.9}>
            <LinearGradient
              colors={[lightenColor(colors.accent, 50), "#8E2DE2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playButton}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={26}
                color="#fff"
                style={isPlaying ? {} : { marginLeft: 2 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Pressable
          style={styles.waveformContainer}
          onPress={(e) => {
            if (!isLoaded || duration === 0) return;
            const { locationX } = e.nativeEvent;
            const progress = Math.max(0, Math.min(locationX / width(0.6), 1));
            seekToPosition(progress);
          }}
        >
          <View style={styles.waveform}>
            {animatedValues.map((val, i) => {
              const isActive = i / animatedValues.length <= progress;
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.waveformBar,
                    {
                      height: val.interpolate({
                        inputRange: [0, 1],
                        outputRange: [3, 24],
                      }),
                      backgroundColor: isActive ? "#ffff" : "#ccc",
                      opacity: isActive ? 1 : 0.4,
                    },
                  ]}
                />
              );
            })}
          </View>
          <View
            style={[
              styles.progressDot,
              {
                left: `${progress * 100}%`,
                backgroundColor: colors.accent,
                borderRadius: width(0.5),
              },
            ]}
          />
        </Pressable>

        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: colors.text }]}>
            {currentTime} / {totalTime}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: height(0.01),
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    width: width(0.5),
    justifyContent: "space-between",
  },
  playButtonContainer: {
    marginRight: 12,
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF0069",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  waveformContainer: {
    flex: 1,
    height: 32,
    justifyContent: "center",
    marginRight: 12,
    position: "relative",
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  waveformBar: {
    width: 1,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  progressDot: {
    position: "absolute",
    top: "50%",
    marginTop: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  timeContainer: {
    minWidth: width(0.2),
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
